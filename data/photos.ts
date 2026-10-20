export const photos = {
  table: {
    src: "/photos/table.webp",
    alt: "Clay plates and a bowl of salsa on a wood table in warm window light",
  },
  pastor: {
    src: "/photos/pastor.webp",
    alt: "Three al pastor tacos with pineapple on a clay plate",
  },
  asada: {
    src: "/photos/asada.webp",
    alt: "Sliced grilled steak with rice, beans, and corn tortillas",
  },
  enchiladas: {
    src: "/photos/enchiladas.webp",
    alt: "Three enchiladas in a red chile sauce with rice and beans",
  },
  mole: {
    src: "/photos/mole.webp",
    alt: "Chicken in a dark mole sauce with sesame, rice, and beans",
  },
  fajitas: {
    src: "/photos/fajitas.webp",
    alt: "A skillet of steak, shrimp, and chicken fajitas with peppers and onions",
  },
  birria: {
    src: "/photos/birria.webp",
    alt: "Three beef birria tacos beside a cup of consomé",
  },
  pozole: {
    src: "/photos/pozole.webp",
    alt: "A bowl of red pozole with cabbage, radish, and lime",
  },
  antojitos: {
    src: "/photos/antojitos.webp",
    alt: "Guacamole in a stone bowl, with a cup of elote beside it",
  },
  relleno: {
    src: "/photos/relleno.webp",
    alt: "A roasted poblano chile relleno with rice and beans",
  },
  postres: {
    src: "/photos/postres.webp",
    alt: "Cinnamon churros beside a slice of caramel flan",
  },
  margarita: {
    src: "/photos/margarita.webp",
    alt: "A rocks margarita with a salted rim and a lime wheel",
  },
  aguas: {
    src: "/photos/aguas.webp",
    alt: "Three aguas frescas: horchata, jamaica, and tamarindo",
  },
  kitchen: {
    src: "/photos/kitchen.webp",
    alt: "The kitchen pass, with a comal, red salsa, and clay plates",
  },
} as const;

export type PhotoId = keyof typeof photos;
