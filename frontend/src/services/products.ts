import { useQuery } from "@tanstack/react-query";
import type { ProductCategory } from "@/data/products";
import { normalizeProductImages } from "@/data/products";

interface GoogleProduct {
  nome: string;
  imagem: string;
  categoria: string;
  valorVenda: number;
}

export interface CatalogProduct {
  id: string;
  name: string;
  images: string[];
  category: ProductCategory | "todos";
  price: string;
  description?: string;
  details?: string[];
}

export const catalogProductsQueryKey = ["catalog-products"];

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value ?? 0);

const parseProductImages = (rawImages: string) =>
  normalizeProductImages(rawImages?.split(";"));

export const fetchCatalogProducts = async (): Promise<CatalogProduct[]> => {
  const url = import.meta.env.VITE_GET_GOOGLE_SHEET_URL;

  if (!url) {
    throw new Error("URL da planilha nao configurada no .env");
  }

  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.products || !Array.isArray(data.products)) {
    throw new Error("Formato de dados invalido: 'products' nao encontrado");
  }

  return data.products.map((p: GoogleProduct, index: number) => {
    const rawCategory = p.categoria?.toLowerCase().trim();
    const category =
      rawCategory && rawCategory !== ""
        ? (rawCategory as ProductCategory)
        : "todos";

    return {
      id: `sheet-${index}`,
      name: p.nome,
      images: parseProductImages(p.imagem),
      category,
      price: formatBRL(Number(p.valorVenda)),
    };
  });
};

export const useCatalogProducts = () =>
  useQuery({
    queryKey: catalogProductsQueryKey,
    queryFn: fetchCatalogProducts,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
