export type ModifierChoice = { id: string; name: string; price: number };

export type ModifierGroup = {
  id: string;
  name: string;
  min: number;
  max: number;
  choices: ModifierChoice[];
};

export const modifierGroups: ModifierGroup[] = [
  {
    id: "salsa",
    name: "Salsa",
    min: 0,
    max: 1,
    choices: [
      { id: "mild", name: "Mild, tomatillo", price: 0 },
      { id: "medium", name: "Medium, chile de árbol", price: 0 },
      { id: "hot", name: "Hot, habanero", price: 0 },
    ],
  },
  {
    id: "taco-finish",
    name: "Finish",
    min: 0,
    max: 4,
    choices: [
      { id: "no-onion", name: "No onion", price: 0 },
      { id: "no-cilantro", name: "No cilantro", price: 0 },
      { id: "queso", name: "Queso fresco", price: 75 },
      { id: "guac", name: "Guacamole", price: 150 },
    ],
  },
  {
    id: "consome",
    name: "Consomé",
    min: 0,
    max: 1,
    choices: [{ id: "cup", name: "Cup of consomé", price: 150 }],
  },
  {
    id: "plate-protein",
    name: "Protein",
    min: 1,
    max: 1,
    choices: [
      { id: "pastor", name: "Al pastor", price: 0 },
      { id: "asada", name: "Carne asada", price: 100 },
      { id: "carnitas", name: "Carnitas", price: 0 },
      { id: "pollo", name: "Pollo asado", price: 0 },
      { id: "hongos", name: "Hongos", price: 0 },
      { id: "nopal", name: "Nopal", price: 0 },
      { id: "papa", name: "Papa con rajas", price: 0 },
      { id: "pescado", name: "Pescado", price: 250 },
      { id: "camaron", name: "Camarón", price: 300 },
      { id: "birria", name: "Birria", price: 200 },
    ],
  },
  {
    id: "enchilada-filling",
    name: "Filling",
    min: 1,
    max: 1,
    choices: [
      { id: "queso", name: "Cheese", price: 0 },
      { id: "pollo", name: "Chicken", price: 0 },
      { id: "deshebrada", name: "Shredded beef", price: 100 },
      { id: "carnitas", name: "Carnitas", price: 100 },
    ],
  },
  {
    id: "tamal-filling",
    name: "Filling",
    min: 1,
    max: 1,
    choices: [
      { id: "pork", name: "Pork in red chile", price: 0 },
      { id: "pollo", name: "Chicken in green chile", price: 0 },
      { id: "rajas", name: "Rajas con queso", price: 0 },
    ],
  },
  {
    id: "sope-top",
    name: "Topping",
    min: 1,
    max: 1,
    choices: [
      { id: "queso", name: "Beans and cheese", price: 0 },
      { id: "pastor", name: "Al pastor", price: 150 },
      { id: "asada", name: "Carne asada", price: 200 },
      { id: "carnitas", name: "Carnitas", price: 150 },
    ],
  },
  {
    id: "nacho-top",
    name: "Topping",
    min: 1,
    max: 1,
    choices: [
      { id: "queso", name: "Beans and cheese", price: 0 },
      { id: "pastor", name: "Al pastor", price: 200 },
      { id: "asada", name: "Carne asada", price: 250 },
      { id: "pollo", name: "Pollo", price: 200 },
    ],
  },
  {
    id: "salad-protein",
    name: "Protein",
    min: 1,
    max: 1,
    choices: [
      { id: "beans", name: "Beans", price: 0 },
      { id: "pollo", name: "Chicken", price: 150 },
      { id: "asada", name: "Carne asada", price: 250 },
      { id: "carnitas", name: "Carnitas", price: 200 },
    ],
  },
  {
    id: "bowl",
    name: "How to plate it",
    min: 1,
    max: 1,
    choices: [
      { id: "tortilla", name: "Flour tortilla", price: 0 },
      { id: "bowl", name: "Bowl, no tortilla", price: 0 },
    ],
  },
  {
    id: "burrito-add",
    name: "Add or leave off",
    min: 0,
    max: 3,
    choices: [
      { id: "guac", name: "Guacamole", price: 250 },
      { id: "no-cheese", name: "No cheese", price: 0 },
      { id: "no-rice", name: "No rice", price: 0 },
    ],
  },
  {
    id: "fajita-tortilla",
    name: "Tortillas",
    min: 1,
    max: 1,
    choices: [
      { id: "flour", name: "Flour", price: 0 },
      { id: "corn", name: "Corn", price: 0 },
    ],
  },
  {
    id: "mole-protein",
    name: "With",
    min: 1,
    max: 1,
    choices: [
      { id: "pollo", name: "Chicken", price: 0 },
      { id: "hongos", name: "Mushrooms", price: 0 },
    ],
  },
  {
    id: "beans",
    name: "Beans",
    min: 1,
    max: 1,
    choices: [
      { id: "refritos", name: "Refried", price: 0 },
      { id: "olla", name: "De la olla", price: 0 },
    ],
  },
  {
    id: "kids-taco",
    name: "Filling",
    min: 1,
    max: 1,
    choices: [
      { id: "pollo", name: "Chicken", price: 0 },
      { id: "queso", name: "Cheese", price: 0 },
    ],
  },
];

export const groupById: Record<string, ModifierGroup> = Object.fromEntries(
  modifierGroups.map((group) => [group.id, group]),
);
