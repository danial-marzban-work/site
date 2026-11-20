import espresso from "@/assets/espresso.webp";
import americano from "@/assets/americano.webp";
import latte from "@/assets/latte.webp";
import macchiato from "@/assets/macchiato.webp";
import irish from "@/assets/irish-coffee.webp";
import flatWhite from "@/assets/flat-white.webp";
import lungo from "@/assets/lungo.webp";
import vienna from "@/assets/vienna-coffee.webp";

export type Product = {
  name: string;
  description: string;
  price: string;
  image: string;
};

export const categories = [
  "Iced coffee",
  "Milk-Based Coffee",
  "Classic Coffee",
  "Specialty Coffee",
  "Sweet Coffee",
];

export const rowOne: Product[] = [
  { name: "Espresso", description: "pure strong coffee", price: "5.70$", image: espresso },
  { name: "Americano", description: "espresso + hot water", price: "4.50$", image: americano },
  { name: "Latte", description: "espresso + lots of milk + little foam", price: "4.30$", image: latte },
  { name: "Macchiato", description: "espresso + small milk foam", price: "5.50$", image: macchiato },
];

export const rowTwo: Product[] = [
  { name: "Irish Coffee", description: "coffee + whiskey + cream", price: "5.40$", image: irish },
  { name: "Flat White", description: "espresso + thin layer of milk foam", price: "4.20$", image: flatWhite },
  { name: "Lungo", description: "long espresso, more water", price: "4.80$", image: lungo },
  { name: "Vienna Coffee", description: "espresso + whipped cream", price: "5.20$", image: vienna },
];
