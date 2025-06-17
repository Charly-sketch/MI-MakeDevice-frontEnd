import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Typography,
  Checkbox,
  FormLabel,
  Grid,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import { Dispatch, SetStateAction } from "react";

function EnclosureControls(props: {
  viewable: number;
  lidOn: boolean;
  handleEnclosurePreviewRefresh: () => void;
  setLidOn: Dispatch<SetStateAction<boolean>>;
}) {
  const { viewable, lidOn, handleEnclosurePreviewRefresh, setLidOn } = props;

  // pass the value of the enclosure lid toggle back to parent comp
  const handleLidOnOffToggleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const toggleValue = event.target.checked;

    setLidOn(toggleValue);
  };

  return (
    <>
      <Box component={"div"} padding={"1em"}>
        {/* <Typography
          variant={"subtitle1"}
          fontStyle={"oblique"}
          display={"inline"}
        >
          Enclosure controls{" "}
        </Typography> */}

        <Grid container /* sx={{ display: "flex-end" }} */>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                handleEnclosurePreviewRefresh();
              }}
            >
              Refresh Model
            </Button>
          </Grid>
          <Grid item xs={6}>
            <FormGroup>
              <FormControlLabel
                sx={{ fontSize: "4em" }}
                value="start"
                control={
                  <Switch
                    color="primary"
                    checked={lidOn}
                    onChange={handleLidOnOffToggleChange}
                  />
                }
                label="Lid On/Off"
                labelPlacement="start"
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default EnclosureControls;
