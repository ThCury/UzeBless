import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export type ProductCategory = "colar" | "brinco" | "pulseira" | "anel" | "kit" | "outros";

export interface Product {
  id: string;
  images: string[];
  name: string;
  price: string;
  category: ProductCategory;
  description?: string;
  details?: string[];
}

export const products: Product[] = [
  {
    id: "colar-corrente-dupla",
    images: [product1, product2, product3],
    name: "Colar Corrente Dupla",
    price: "R$ 89,90",
    category: "colar",
    description: "Colar de corrente dupla banhado a ouro 18k, perfeito para compor looks sofisticados no dia a dia.",
    details: ["Banho de ouro 18k", "Comprimento: 45cm + extensor de 5cm", "Fecho lagosta", "Antialérgico"],
  },
  {
    id: "argolas-douradas",
    images: [product2, product1, product4],
    name: "Argolas Douradas",
    price: "R$ 59,90",
    category: "brinco",
    description: "Argolas clássicas douradas com acabamento espelhado. Elegância atemporal para qualquer ocasião.",
    details: ["Banho de ouro 18k", "Diâmetro: 3cm", "Fecho clique", "Antialérgico"],
  },
  {
    id: "pulseira-perola",
    images: [product3, product5, product6],
    name: "Pulseira Pérola",
    price: "R$ 49,90",
    category: "pulseira",
    description: "Pulseira delicada com pérolas de água doce. Um toque de elegância e feminilidade.",
    details: ["Pérolas naturais de água doce", "Comprimento: 18cm + extensor", "Fecho lagosta banhado a ouro", "Antialérgico"],
  },
  {
    id: "anel-solitario",
    images: [product4, product1, product2],
    name: "Anel Solitário",
    price: "R$ 79,90",
    category: "anel",
    description: "Anel solitário com pedra de zircônia cravejada. Brilho e sofisticação em uma peça única.",
    details: ["Banho de ouro 18k", "Pedra de zircônia", "Ajustável", "Antialérgico"],
  },
  {
    id: "colar-pingente-cristal",
    images: [product5, product3, product6],
    name: "Colar Pingente Cristal",
    price: "R$ 99,90",
    category: "colar",
    description: "Colar com pingente de cristal lapidado que reflete luz de forma deslumbrante.",
    details: ["Banho de ouro 18k", "Cristal lapidado", "Comprimento: 40cm + extensor de 5cm", "Antialérgico"],
  },
  {
    id: "kit-aneis-dourados",
    images: [product6, product4, product5],
    name: "Kit Anéis Dourados",
    price: "R$ 69,90",
    category: "kit",
    description: "Kit com 3 anéis dourados em diferentes espessuras. Perfeito para usar juntos ou separados.",
    details: ["Banho de ouro 18k", "3 peças", "Ajustáveis", "Antialérgico"],
  },
];
