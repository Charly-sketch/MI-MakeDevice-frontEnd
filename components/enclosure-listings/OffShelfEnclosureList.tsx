import { ENCLOSURES_DATA, EnclosureListing } from "./EnclosureDataStore";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";

const Listing = (props: { listingData: EnclosureListing }) => {
  const { listingData } = props;

  const {
    id,
    long_name,
    stock_available,
    short_name,
    supplier,
    img_srcs,
    datasheet_src,
    ipRating,
    ikRating,
  } = listingData;

  const theme = useTheme();

  return (
    <>
      {" "}
      <Card sx={{ display: "flex", padding: "1em" }}>
        <Box
          component={"div"}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              {long_name}
            </Typography>
            <br />
            {stock_available && (
              <Typography variant="subtitle1" color="green" component="div">
                In stock: {stock_available}
              </Typography>
            )}
            <br />
            <Typography
              variant="subtitle2"
              color="text.primary"
              component="div"
            >
              Supplier: {supplier}
            </Typography>

            {ipRating && (
              <Typography
                variant="subtitle2"
                color="text.primary"
                component="div"
              >
                IP Rating: {ipRating}
              </Typography>
            )}
            {ikRating && (
              <Typography
                variant="subtitle2"
                color="text.primary"
                component="div"
              >
                IK Rating: {ikRating}
              </Typography>
            )}

            {datasheet_src && (
              <Typography fontStyle="bold" variant="subtitle2" color="blue">
                <a href={datasheet_src}>Datasheet</a>
              </Typography>
            )}
          </CardContent>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: "200px" }}
          image={listingData.img_srcs[0]}
          alt={`Image of enclosure ${listingData.long_name}`}
        />
      </Card>
    </>
  );
};

const OffShelfEnclosureList = () => {
  console.log("encData: ", ENCLOSURES_DATA);
  const listItems = ENCLOSURES_DATA.map((item, i) => (
    <Listing key={i} listingData={item} />
  ));

  return (
    <>
      <Box component="div">
        <Typography component={"div"} variant="h5">
          Ready-made Enclosures
        </Typography>
        <Box component="div" style={{ maxHeight: "35em", overflow: "scroll" }}>
          {listItems}
        </Box>
      </Box>
    </>
  );
};

export default OffShelfEnclosureList;
