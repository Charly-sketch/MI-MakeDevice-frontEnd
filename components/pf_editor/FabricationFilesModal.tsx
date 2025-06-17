import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  LinearProgress,
  useTheme,
} from "@mui/material";
import FabricationSettingsModal, {
  FabricationSettings,
  defaultSettings,
} from "./FabricationSettingsModal";
import {
  decodeAndDownloadZip,
  receiveFabricationResults,
  sendFabricationData,
} from "../server-comm/backend_functions";
import { getModulesFromScene, roundToStep } from "./utilFuncs";

interface FabricationFilesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  description?: string;
  projectName?: string;
  editorScene?: any | null;
  initialSettings?: FabricationSettings | undefined;
  onComplete?: () => void;
  setFabricationFilesModalOpen?;
}

const FabricationFilesModal: React.FC<FabricationFilesModalProps> = ({
  open,
  setOpen,
  title = "Generate Fabrication Files",
  description = "Please wait while we prepare your fabrication files...",
  projectName = "fabrication_files",
  editorScene = null,
  initialSettings = undefined,

  onComplete,
}) => {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [fabricationOptionsOpen, setFabricationOptionsOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState(
    projectName ? `${projectName}.zip` : "fabrication_files.zip",
  );

  const [settings, setSettings] = useState<FabricationSettings>(() => {
    if (!initialSettings) return defaultSettings;

    // Deep merge of initialSettings with defaultSettings
    return {
      ...JSON.parse(JSON.stringify(defaultSettings)),
      ...initialSettings,
      board: {
        ...defaultSettings.board,
        ...initialSettings.board,
      },
      configuration: {
        ...defaultSettings.configuration,
        ...initialSettings.configuration,
        routing_options: {
          ...defaultSettings.configuration?.routing_options,
          ...initialSettings.configuration?.routing_options,
        },
      },
    };
  });

  // Update projectName when settings.board.name changes
  useEffect(() => {
    if (settings.board?.name) {
      setFileName(`${settings.board.name}.zip`);
    }
  }, [settings.board?.name]);

  const onSettingsSave = (settings) => {
    setSettings(settings);
  };

  const [lastTimestamp, setLastTimestamp] = useState(0);

  useEffect(() => {
    if (generating) {
      // Reset progress when modal opens
      setProgress(0);
      // const interval = setInterval(() => {
      //   setProgress((prevProgress) => {
      //     const newProgress = prevProgress + 1;

      //     if (newProgress >= 100) {
      //       clearInterval(interval);
      //       if (onComplete) {
      //         setTimeout(onComplete, 300);
      //       }
      //       return 100;
      //     }

      const interval = setInterval(() => {
        fetch("http://localhost:3333/progress")
          .then((response) => response.json())
          .then((data) => {
            const { timestamp, progress: newProgress } = data;

            if (timestamp > lastTimestamp) {
              setLastTimestamp(timestamp);
              setProgress(newProgress);
            }

            if (newProgress >= 100) {
              clearInterval(interval);
              if (onComplete) {
                setTimeout(onComplete, 300);
              }
            }
          })
          .catch((error) => console.error("Error fetching progress:", error));
      }, 1000); // Poll every second

      //     return newProgress;
      //   });
      // }, 50); // 5000ms / 100 steps = 50ms per step

      return () => clearInterval(interval);
    }
  }, [generating, onComplete]);

  const handleGenerate = async () => {
    setGenerating(true);

    // get latest scene data
    if (editorScene !== null) {
      if (editorScene) {
        const modules = getModulesFromScene(editorScene);
        settings.modules = [];
        // Round all position values to nearest resolution value
        const resolution =
          settings.configuration.routing_options.resolution || 1;

        settings.modules = modules.map((module) => {
          return {
            ...module,
            rotation: roundToStep(module.rotation, 90),
            position: {
              x: roundToStep(module.position.x, resolution), //roundToStep(module.position.y, resolution), //roundToStep(module.position.x, resolution),
              y: roundToStep(module.position.y, resolution),
            },
          };
        });
      }
    }

    console.log("settingssending...", settings);

    if (settings.configuration.fabrication_options.connectors.bottom) {
      console.log("adding jacdac_connector_0.1 bottom");
      settings.modules.push({
        name: "jacdac_connector_0.1",
        position: {
          x: 0,
          y: -Math.abs(settings.board.size.y / 2),
        },
        rotation: 180,
      });
    }

    if (settings.configuration.fabrication_options.connectors.top) {
      console.log("adding jacdac_connector_0.1 top");
      settings.modules.push({
        name: "jacdac_connector_0.1",
        position: {
          x: 0,
          y: Math.abs(settings.board.size.y / 2),
        },
        rotation: 0,
      });
    }
    sendFabricationData(settings)
      .then(async (response) => {
        if (response.success === true) {
          console.log(response);
          // Integration with JLCPCB, Eurocircuits etc.
          if (response.order_urls) {
            for (let key in response.order_urls) {
              const url = response.order_urls[key];
              console.log(key, "order URL:", url);
              if (url) {
                window.open(url, "_blank");
              }
            }
          }

          const blob = await decodeAndDownloadZip(response.result);

          // Create a URL for the blob but don't trigger download yet
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);

          // Set the filename
          const name = settings.board.name
            ? settings.board.name
            : "fabrication_files.zip";
          setFileName(name);
        } else {
          // Get error code and message
          console.error("Error generating fabrication files:", response.error);
          alert("Error generating fabrication files: " + response.error);
        }
      })
      .catch((error) => {
        if (error.toString().indexOf("Status: 500") !== -1) {
          alert(
            "Routing failed, try repositioning the modules, increasing the board size, or changing settings.",
          );
        } else {
          console.error("Error handling fabrication:", error);
          alert("Unable to connect to backend server");
        }
      });
  };

  const handleDownload = () => {
    if (downloadUrl) {
      // Create temporary link element to trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const onClose = () => {
    setOpen(false);
    // Clean up any object URLs to prevent memory leaks
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  return (
    <Modal
      open={open}
      onClose={progress >= 100 ? onClose : undefined}
      aria-labelledby="fabrication-files-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: theme.shape.borderRadius,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            cursor: "pointer",
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: "bold",
              lineHeight: 1,
              color: "text.secondary",
            }}
          >
            ×
          </Typography>
        </Box>
        <Typography
          id="fabrication-files-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 500 }}
        >
          {title}
        </Typography>

        {generating === true && (
          <>
            <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
              {description}
            </Typography>

            <Box sx={{ width: "100%", mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {Math.round(progress)}%
              </Typography>
            </Box>
          </>
        )}

        {fabricationOptionsOpen && (
          <FabricationSettingsModal
            open={fabricationOptionsOpen}
            onClose={() => setFabricationOptionsOpen(false)}
            onSave={onSettingsSave}
            initialSettings={settings}
          />
        )}

        {generating === false && (
          <Box>
            <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
              You can generate fabrication files for your project. If you need
              to congigure the settings, click on the &quot;Settings...&quot;
              button.
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Box
                component="button"
                onClick={() => setFabricationOptionsOpen(true)}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: theme.shape.borderRadius,
                  fontWeight: 500,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Settings...
              </Box>
              <Box
                component="button"
                onClick={handleGenerate}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: theme.shape.borderRadius,
                  fontWeight: 500,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Generate
              </Box>
            </Box>
          </Box>
        )}

        {progress === 100 && generating === true && (
          <Box
            sx={{
              mt: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: progress === 100 ? "space-between" : "center",
            }}
          >
            {progress === 100 && (
              <>
                <Typography variant="body1">{fileName}</Typography>
                <Box
                  component="button"
                  onClick={handleDownload}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: theme.shape.borderRadius,
                    fontWeight: 500,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  Download
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default FabricationFilesModal;
