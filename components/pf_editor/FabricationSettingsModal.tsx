import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Grid,
} from "@mui/material";

interface FabricationSettingsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (settings: FabricationSettings) => void;
  initialSettings?: FabricationSettings;
}

interface Board {
  name: string;
  generation_software: {
    vendor: "Devices-Lab";
    application: "MakeDevice";
    version: "0.1";
  };
  size: { x: number; y: number };
  origin: { x: 0; y: 0 };
  debug: true;
}

interface Configuration {
  routing_options: {
    resolution: 0.25;
    allow_diagonal_traces: true;
    allow_overlap: false;
    algorithm: "a_star";
  };
  gerbersockets_options: {
    layer_name: "GerberSockets.gbr";
    keep_out_zone_aperture_diameter: 0.1;
    net_diameter_map: {
      "JD_PWR": 0.11;
      "GND": 0.12;
      "JD_DATA": 0.13;
      "SWCLK": 0.14;
      "SWDIO~^": 0.16;
      "RESET": 0.17;
      "USB_D_P": 0.18;
      "USB_D_N": 0.19;
      "SWDIO~0": 0.20;
      "SWDIO~1": 0.21;
      "SWDIO~2": 0.22;
      "SWDIO~3": 0.23;
      "SWDIO~4": 0.24;
      "SWDIO~5": 0.25;
      "SWDIO~6": 0.26;
      "SWDIO~7": 0.27;
      "SWDIO~8": 0.28;
      "SWDIO~9": 0.29;
      "SWDIO~10": 0.30;
    };
    legacy_sockets: true;
  };
  layer_map: {
    "F_Cu.gtl": {
      nets: [];
      fill: false;
      attributes: "Copper,L1,Top,Signal";
    };
    "In1_Cu.g2": {
      nets: [];
      fill: false;
      attributes: "Copper,L2,Inner,Signal";
    };
    "In2_Cu.g3": {
      nets: [];
      fill: false;
      attributes: "Copper,L3,Inner,Signal";
    };
    "B_Cu.gbl": {
      nets: ["SWDIO~", "SWDIO~^"];
      fill: false;
      attributes: "Copper,L4,Bottom,Signal";
    };
  };
  fabrication_options: {
    module_margin: 0;
    bus_width: 0.25;
    bus_spacing: 0.5;
    edge_clearance: 0.5;
    track_width: 0.125;
    via_diameter: number;
    via_hole_diameter: number;
    rounded_corner_radius: number;
    connectors: {
      left: boolean;
      right: boolean;
      bottom: boolean;
      top: boolean;
    };
  };
}

export interface Module {
  name: string;
  position: { x: number; y: number };
  rotation: number;
}

export interface FabricationSettings {
  board: Board;
  configuration: Configuration;
  modules: Module[];
}

export const defaultSettings: FabricationSettings = {
  board: {
    name: "",
    generation_software: {
      vendor: "Devices-Lab",
      application: "MakeDevice",
      version: "0.1",
    },
    size: { x: 100, y: 100 },
    origin: { x: 0, y: 0 },
    debug: true,
  },

  configuration: {
    routing_options: {
      resolution: 0.25,
      allow_diagonal_traces: true,
      allow_overlap: false,
      algorithm: "a_star",
    },
    gerbersockets_options: {
      layer_name: "GerberSockets.gbr",
      keep_out_zone_aperture_diameter: 0.1,
      net_diameter_map: {
        "JD_PWR": 0.11,
        "GND": 0.12,
        "JD_DATA": 0.13,
        "SWCLK": 0.14,
        "SWDIO~^": 0.16,
        "RESET": 0.17,
        "USB_D_P": 0.18,
        "USB_D_N": 0.19,
        "SWDIO~0": 0.20,
        "SWDIO~1": 0.21,
        "SWDIO~2": 0.22,
        "SWDIO~3": 0.23,
        "SWDIO~4": 0.24,
        "SWDIO~5": 0.25,
        "SWDIO~6": 0.26,
        "SWDIO~7": 0.27,
        "SWDIO~8": 0.28,
        "SWDIO~9": 0.29,
        "SWDIO~10": 0.30
      },
      legacy_sockets: true,
    },
    layer_map: {
      "F_Cu.gtl": {
        nets: [],
        fill: false,
        attributes: "Copper,L1,Top,Signal",
      },
      "In1_Cu.g2": {
        nets: [],
        fill: false,
        attributes: "Copper,L2,Inner,Signal",
      },
      "In2_Cu.g3": {
        nets: [],
        fill: false,
        attributes: "Copper,L3,Inner,Signal",
      },
      "B_Cu.gbl": {
        nets: ["GND"],
        fill: true,
        attributes: "Copper,L4,Bottom,Signal",
      },
    },
    fabrication_options: {
      module_margin: 0,
      bus_width: 0.25,
      bus_spacing: 0.5,
      edge_clearance: 0.5,
      track_width: 0.125,
      via_diameter: 0.35,
      via_hole_diameter: 0.2,
      rounded_corner_radius: 5,
      connectors: {
        left: false,
        right: false,
        bottom: false,
        top: false,
      },
    },
  },

  modules: [],
};

export default function FabricationSettingsModal({
  open,
  onClose,
  onSave,
  initialSettings,
}: FabricationSettingsModalProps) {
  const [settings, setSettings] = useState<FabricationSettings>(
    initialSettings || defaultSettings,
  );
  const [layerMapExpanded, setLayerMapExpanded] = useState<boolean>(false);

  const handleSave = () => {
    console.log("SETTINGS: ", settings);
    onSave(settings);
    onClose();
  };
  // This function is no longer needed as we're using useState

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Configure Fabrication</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Board Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Board Name"
              fullWidth
              value={settings.board.name}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  board: { ...settings.board, name: e.target.value },
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Width (mm)"
              type="number"
              fullWidth
              value={settings.board.size.x}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  board: {
                    ...settings.board,
                    size: {
                      ...settings.board.size,
                      x: parseFloat(e.target.value),
                    },
                  },
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Height (mm)"
              type="number"
              fullWidth
              value={settings.board.size.y}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  board: {
                    ...settings.board,
                    size: {
                      ...settings.board.size,
                      y: parseFloat(e.target.value),
                    },
                  },
                })
              }
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          Routing Options
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Resolution"
              type="number"
              fullWidth
              value={settings.configuration.routing_options.resolution}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  configuration: {
                    ...settings.configuration,
                    routing_options: {
                      ...settings.configuration.routing_options,
                      resolution: parseFloat(e.target.value),
                    },
                  },
                })
              }
              inputProps={{ step: 0.01 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled>
              <InputLabel>Algorithm</InputLabel>
              <Select
                value={settings.configuration.routing_options.algorithm}
                label="Algorithm"
                readOnly
                inputProps={{ readOnly: true }}
              >
                <MenuItem value="a_star">A*</MenuItem>
                <MenuItem value="dijkstra">Dijkstra</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    settings.configuration.routing_options.allow_diagonal_traces
                  }
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      configuration: {
                        ...settings.configuration,
                        routing_options: {
                          ...settings.configuration.routing_options,
                          allow_diagonal_traces: e.target.checked,
                        },
                      },
                    })
                  }
                />
              }
              label="Allow Diagonal Traces"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={settings.configuration.routing_options.allow_overlap}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      configuration: {
                        ...settings.configuration,
                        routing_options: {
                          ...settings.configuration.routing_options,
                          allow_overlap: e.target.checked,
                        },
                      },
                    })
                  }
                />
              }
              label="Allow Overlap"
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          Fabrication Options
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Track Width"
              type="number"
              fullWidth
              value={settings.configuration.fabrication_options.track_width}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  configuration: {
                    ...settings.configuration,
                    fabrication_options: {
                      ...settings.configuration.fabrication_options,
                      track_width: parseFloat(e.target.value),
                    },
                  },
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Via Diameter"
              type="number"
              fullWidth
              value={settings.configuration.fabrication_options.via_diameter}
              inputProps={{ step: 0.01 }}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  configuration: {
                    ...settings.configuration,
                    fabrication_options: {
                      ...settings.configuration.fabrication_options,
                      via_diameter: parseFloat(e.target.value),
                    },
                  },
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Via Hole Diameter"
              type="number"
              fullWidth
              value={
                settings.configuration.fabrication_options.via_hole_diameter
              }
              inputProps={{ step: 0.01 }}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  configuration: {
                    ...settings.configuration,
                    fabrication_options: {
                      ...settings.configuration.fabrication_options,
                      via_hole_diameter: parseFloat(e.target.value),
                    },
                  },
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Connectors</Typography>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        settings.configuration.fabrication_options.connectors
                          .right
                      }
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          configuration: {
                            ...settings.configuration,
                            fabrication_options: {
                              ...settings.configuration.fabrication_options,
                              connectors: {
                                ...settings.configuration.fabrication_options
                                  .connectors,
                                right: e.target.checked,
                              },
                            },
                          },
                        })
                      }
                    />
                  }
                  label="Right"
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        settings.configuration.fabrication_options.connectors
                          .top
                      }
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          configuration: {
                            ...settings.configuration,
                            fabrication_options: {
                              ...settings.configuration.fabrication_options,
                              connectors: {
                                ...settings.configuration.fabrication_options
                                  .connectors,
                                top: e.target.checked,
                              },
                            },
                          },
                        })
                      }
                    />
                  }
                  label="Top"
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        settings.configuration.fabrication_options.connectors
                          .bottom
                      }
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          configuration: {
                            ...settings.configuration,
                            fabrication_options: {
                              ...settings.configuration.fabrication_options,
                              connectors: {
                                ...settings.configuration.fabrication_options
                                  .connectors,
                                bottom: e.target.checked,
                              },
                            },
                          },
                        })
                      }
                    />
                  }
                  label="Bottom"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          Layer Map
        </Typography>
        <div>
          <Button
            onClick={() => setLayerMapExpanded(!layerMapExpanded)}
            variant="outlined"
            sx={{ mb: 1 }}
            fullWidth
          >
            {layerMapExpanded ? "Collapse Layer Map" : "Expand Layer Map"}
          </Button>

          {layerMapExpanded &&
            Object.entries(settings.configuration.layer_map).map(
              ([layerName, layerConfig]) => (
                <Grid
                  container
                  spacing={2}
                  key={layerName}
                  sx={{
                    mb: 2,
                    p: 1,
                    border: "1px solid #eee",
                    borderRadius: 1,
                  }}
                >
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">{layerName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={layerConfig.fill}
                          onChange={(e) => {
                            const updatedLayerMap = {
                              ...settings.configuration.layer_map,
                              [layerName]: {
                                ...layerConfig,
                                fill: e.target.checked,
                              },
                            };
                            setSettings({
                              ...settings,
                              configuration: {
                                ...settings.configuration,
                                layer_map: updatedLayerMap,
                              },
                            });
                          }}
                        />
                      }
                      label="Fill"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Attributes"
                      fullWidth
                      value={layerConfig.attributes}
                      onChange={(e) => {
                        const updatedLayerMap = {
                          ...settings.configuration.layer_map,
                          [layerName]: {
                            ...layerConfig,
                            attributes: e.target.value,
                          },
                        };
                        setSettings({
                          ...settings,
                          configuration: {
                            ...settings.configuration,
                            layer_map: updatedLayerMap,
                          },
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption">Nets</Typography>
                    <Grid container spacing={1} alignItems="center">
                      {layerConfig.nets.map((net, index) => (
                        <Grid
                          item
                          key={index}
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <TextField
                            size="small"
                            value={net}
                            onChange={(e) => {
                              const updatedNets = [...layerConfig.nets];
                              updatedNets[index] = e.target.value;
                              const updatedLayerMap = {
                                ...settings.configuration.layer_map,
                                [layerName]: {
                                  ...layerConfig,
                                  nets: updatedNets,
                                },
                              };
                              setSettings({
                                ...settings,
                                configuration: {
                                  ...settings.configuration,
                                  layer_map: updatedLayerMap,
                                },
                              });
                            }}
                          />
                          <Button
                            size="small"
                            color="error"
                            onClick={() => {
                              const updatedNets = layerConfig.nets.filter(
                                (_, i) => i !== index,
                              );
                              const updatedLayerMap = {
                                ...settings.configuration.layer_map,
                                [layerName]: {
                                  ...layerConfig,
                                  nets: updatedNets,
                                },
                              };
                              setSettings({
                                ...settings,
                                configuration: {
                                  ...settings.configuration,
                                  layer_map: updatedLayerMap,
                                },
                              });
                            }}
                          >
                            Remove
                          </Button>
                        </Grid>
                      ))}
                      <Grid item>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            const updatedNets = [...layerConfig.nets, ""];
                            const updatedLayerMap = {
                              ...settings.configuration.layer_map,
                              [layerName]: {
                                ...layerConfig,
                                nets: updatedNets,
                              },
                            };
                            setSettings({
                              ...settings,
                              configuration: {
                                ...settings.configuration,
                                layer_map: updatedLayerMap,
                              },
                            });
                          }}
                        >
                          Add Net
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ),
            )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
