const PLACEHOLDER_IMAGE = "/placeholder.svg";

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "5500000000000";

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

interface RawProduct {
  nome: string;
  imagem: string;
  categoria: string;
  valorVenda: number;
}

const rawProducts: RawProduct[] = [
  { nome: "Choker mini coração ", imagem: "", categoria: "Colar", valorVenda: 38 },
  { nome: "Pulseira baiano dourado ", imagem: "", categoria: "Pulseira", valorVenda: 39 },
  { nome: "Colar duplo fase ", imagem: "", categoria: "Colar", valorVenda: 40 },
  { nome: "Colar mini coração dourado", imagem: "", categoria: "Colar", valorVenda: 38 },
  { nome: "Choker Helena ", imagem: "", categoria: "Colar", valorVenda: 38 },
  { nome: "Choker Helena Dourado ", imagem: "", categoria: "Colar", valorVenda: 40 },
  { nome: "Hand Chain Singapura Dourado ", imagem: "", categoria: "Outros", valorVenda: 47 },
  { nome: "Choker com bolinhas ", imagem: "", categoria: "Colar", valorVenda: 38 },
  { nome: "trio argola click ", imagem: "", categoria: "Brinco", valorVenda: 53 },
  { nome: "Anel organic ", imagem: "", categoria: "Anel", valorVenda: 47 },
  {
    nome: "Anel organic Dourado ",
    imagem:
      "https://res.cloudinary.com/dqqphpjwv/image/upload/f_auto,q_auto/1000081886_ax2hz3 ;  https://res.cloudinary.com/dqqphpjwv/image/upload/v1774047401/1000081887_ph7niz.jpg ",
    categoria: "Anel",
    valorVenda: 47,
  },
  { nome: "Anel raio de Sol ", imagem: "", categoria: "Anel", valorVenda: 44 },
  { nome: "Choker baiano dourado ", imagem: "", categoria: "Colar", valorVenda: 40 },
  { nome: "Pulseira veneziana bolinha dourada", imagem: "", categoria: "Pulseira", valorVenda: 36 },
  { nome: "Colar duplo fase dourado", imagem: "", categoria: "Colar", valorVenda: 40 },
  { nome: "Colar singapura dourado ", imagem: "", categoria: "Colar", valorVenda: 38 },
  { nome: "Colar Y achatado", imagem: "", categoria: "Colar", valorVenda: 44 },
  { nome: "Anel Brisa Dourado", imagem: "", categoria: "Anel", valorVenda: 53 },
  { nome: "Anel minimalista liso", imagem: "", categoria: "Anel", valorVenda: 47 },
  { nome: "Anel minimalista liso Dourado ", imagem: "", categoria: "Anel", valorVenda: 47 },
  { nome: "Anel sol dourado ", imagem: "", categoria: "Anel", valorVenda: 53 },
  { nome: "Anel fino riscos dourado ", imagem: "", categoria: "Anel", valorVenda: 49 },
  { nome: "Anel fino riscos prata ", imagem: "", categoria: "Anel", valorVenda: 49 },
  { nome: "Anel liso prata", imagem: "", categoria: "Anel", valorVenda: 42 },
  { nome: " brinco argolinha click zirconia ", imagem: "", categoria: "Brinco", valorVenda: 44 },
  { nome: "Colar moeda riscada ", imagem: "", categoria: "Colar", valorVenda: 44 },
  {
    nome: "Anel solitario ",
    imagem: "https://res.cloudinary.com/dqqphpjwv/image/upload/v1774047399/1000081883_pr3hqj.jpg",
    categoria: "Anel",
    valorVenda: 53,
  },
  { nome: "Pulseira chapinha laminadas ", imagem: "", categoria: "Pulseira", valorVenda: 36 },
];

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value ?? 0);

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const normalizeProductImages = (images?: Array<string | undefined | null>) => {
  const normalized = (images ?? [])
    .map((image) => image?.trim())
    .filter((image): image is string => Boolean(image));

  return normalized.length > 0 ? normalized : [PLACEHOLDER_IMAGE];
};

export const getPrimaryProductImage = (images?: string[]) =>
  normalizeProductImages(images)[0];

const normalizeCategory = (category: string): ProductCategory => {
  const normalized = category.trim().toLowerCase();

  if (normalized === "colar") return "colar";
  if (normalized === "brinco") return "brinco";
  if (normalized === "pulseira") return "pulseira";
  if (normalized === "anel") return "anel";
  if (normalized === "kit") return "kit";

  return "outros";
};

export const products: Product[] = rawProducts.map((product, index) => {
  const name = product.nome.trim();
  const category = normalizeCategory(product.categoria);

  return {
    id: `${slugify(name)}-${index + 1}`,
    name,
    images: normalizeProductImages(product.imagem.split(";")),
    category,
    price: formatBRL(product.valorVenda),
  };
});
