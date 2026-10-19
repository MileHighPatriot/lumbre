export const photos = {
  table: {
    src: "/photos/table.jpg",
    alt: "Clay plates and a bowl of salsa on a wood table in warm window light",
  },
  pastor: {
    src: "/photos/pastor.jpg",
    alt: "Three al pastor tacos with pineapple on a clay plate",
  },
  asada: {
    src: "/photos/asada.jpg",
    alt: "Sliced grilled steak with rice, beans, and corn tortillas",
  },
  enchiladas: {
    src: "/photos/enchiladas.jpg",
    alt: "Three enchiladas in a red chile sauce with rice and beans",
  },
  mole: {
    src: "/photos/mole.jpg",
    alt: "Chicken in a dark mole sauce with sesame, rice, and beans",
  },
  fajitas: {
    src: "/photos/fajitas.jpg",
    alt: "A skillet of steak, shrimp, and chicken fajitas with peppers and onions",
  },
  birria: {
    src: "/photos/birria.jpg",
    alt: "Three beef birria tacos beside a cup of consomé",
  },
  pozole: {
    src: "/photos/pozole.jpg",
    alt: "A bowl of red pozole with cabbage, radish, and lime",
  },
  antojitos: {
    src: "/photos/antojitos.jpg",
    alt: "Guacamole in a stone bowl, with a cup of elote beside it",
  },
  relleno: {
    src: "/photos/relleno.jpg",
    alt: "A roasted poblano chile relleno with rice and beans",
  },
  postres: {
    src: "/photos/postres.jpg",
    alt: "Cinnamon churros beside a slice of caramel flan",
  },
  margarita: {
    src: "/photos/margarita.jpg",
    alt: "A rocks margarita with a salted rim and a lime wheel",
  },
  aguas: {
    src: "/photos/aguas.jpg",
    alt: "Three aguas frescas: horchata, jamaica, and tamarindo",
  },
  kitchen: {
    src: "/photos/kitchen.jpg",
    alt: "The kitchen pass, with a comal, red salsa, and clay plates",
  },
} as const;

export type PhotoId = keyof typeof photos;
