import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const handleOrderPrintClick = () => {
  console.log("ordering 3d print....");
};

const cardContent = (
  <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 24 }} color="text.primary" gutterBottom>
        3D Printing Services
      </Typography>
      <Typography variant="h5" component="div"></Typography>

      <Typography variant="body2">
        An alternative to 3D printing an enclosure yourself is to use an
        existing service. Many organisations provide this, and through
        MakeDevice you can utilise these services to order your enclosure at
        greater scales. Find out more below.{" "}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small">
        <Link
          href={
            "https://www.bcn3d.com/the-beginners-guide-to-3d-printing-6-steps/"
          }
        >
          Learn More
        </Link>
      </Button>
      <Button size="medium" onClick={handleOrderPrintClick}>
        Start an order
      </Button>
    </CardActions>
  </React.Fragment>
);

const Order3DPrint = (props: {}) => {
  return (
    <>
      <Box
        component="div"
        /*   sx={{ minWidth: 275, minHeight: "15em", maxHeight: "20em" }} */
      >
        <Card
          variant="outlined"
          /* sx={{ minWidth: 275, minHeight: "15em", maxHeight: "20em" }} */
          /* sx={{ minWidth: "25%", minHeight: "25%" }} */
        >
          {cardContent}
        </Card>
      </Box>
    </>
  );
};

export default Order3DPrint;
