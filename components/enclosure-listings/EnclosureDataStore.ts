export type EnclosureListing = {
  id: number;
  long_name: string;
  stock_available?: number;
  short_name?: string;
  supplier: string;
  img_srcs: string[];
  datasheet_src?: string[];
  outer_dimensions?: { x: number; y: number; z: number };
  inner_dimensions?: { x: number; y: number; z: number };
  tags?: string[];
  ikRating?: string;
  ipRating?: string;
};

export const ENCLOSURES_DATA: EnclosureListing[] = [
  {
    id: 1,
    long_name:
      "RS PRO Grey Polycarbonate Enclosure, IP68, IK07, Grey Lid, 105 x 70 x 40mm",
    stock_available: 10,
    outer_dimensions: { x: 105, y: 70, z: 40 },
    supplier: "RS Components",
    img_srcs: ["/enclosureImages/RS_Pro_Grey_Polycarbonate_Enclosure/1.jpg"],
    datasheet_src: [
      "/enclosureImages/RS_Pro_Grey_Polycarbonate_Enclosure/RS_Pro_Grey_Polycarbonate_Datasheet.pdf",
    ],
    ikRating: "IK07",
    ipRating: "IP68",
  },

  {
    id: 2,
    long_name:
      " RS PRO General Purpose Enclosures-Die Cast Aluminium Enclosure",
    stock_available: 10,
    outer_dimensions: { x: 55.1, y: 114.4, z: 63.7 },
    supplier: "RS Components",
    img_srcs: ["/enclosureImages/RS_Pro_Diecast_Enclosure/1.png"],
    datasheet_src: ["/enclosureImages/RS_Pro_Diecast_Enclosure/datasheet.pdf"],
  },

  {
    id: 3,
    long_name:
      "RS PRO Grey ABS, Polycarbonate Enclosure, IP68, IK07, Flanged, Transparent Lid, 105 x 70 x 40mm",
    stock_available: 10,
    outer_dimensions: { x: 55.1, y: 114.4, z: 63.7 },
    supplier: "RS Components",
    img_srcs: ["/enclosureImages/RS_Pro_Diecast_Enclosure/1.png"],
    datasheet_src: ["/enclosureImages/RS_Pro_Diecast_Enclosure/datasheet.pdf"],
  },

  {
    id: 2,
    long_name:
      " RS PRO General Purpose Enclosures-Die Cast Aluminium Enclosure",
    stock_available: 10,
    outer_dimensions: { x: 55.1, y: 114.4, z: 63.7 },
    supplier: "RS Components",
    img_srcs: ["/enclosureImages/RS_Pro_Diecast_Enclosure/1.png"],
    datasheet_src: ["/enclosureImages/RS_Pro_Diecast_Enclosure/datasheet.pdf"],
  },

  {
    id: 2,
    long_name:
      " RS PRO General Purpose Enclosures-Die Cast Aluminium Enclosure",
    stock_available: 10,
    outer_dimensions: { x: 55.1, y: 114.4, z: 63.7 },
    supplier: "RS Components",
    img_srcs: ["/enclosureImages/RS_Pro_Diecast_Enclosure/1.png"],
    datasheet_src: ["/enclosureImages/RS_Pro_Diecast_Enclosure/datasheet.pdf"],
  },

  /*   { id: 3,
    long_name: ''
  }, */

  /*
  { id: 4 },

  { id: 5 },

  { id: 6 },

  { id: 7 },

  { id: 8 },

  { id: 9 },

  { id: 10 }, */
];
