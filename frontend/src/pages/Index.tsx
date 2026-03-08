import { useState, useMemo, useEffect } from "react";
import { MessageCircle, Instagram, Search, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { WHATSAPP_NUMBER, type ProductCategory } from "@/data/products";

// Import da sua imagem de fallback
import heroImage from "@/assets/wallpaper1.jpeg";
import placeholderImage from "@/assets/in-prep.jpg";

interface GoogleProduct {
  nome: string;
  imagem: string;
  categoria: string;
  valorVenda: number;
}

const categories: { value: ProductCategory | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "colar", label: "Colares" },
  { value: "anel", label: "Anéis" },
  { value: "pulseira", label: "Pulseiras" },
  { value: "brinco", label: "Brincos" },
  { value: "kit", label: "Kits" },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "todos">("todos");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(false)

      const url = import.meta.env.VITE_GET_GOOGLE_SHEET_URL

      console.log("[Catalog] URL carregada do .env:", url)

      if (!url) {
        console.error("[Catalog] URL da planilha não configurada no .env")
        setError(true)
        return
      }

      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
      })

      console.log("[Catalog] Status:", response.status, response.statusText)
      console.log("[Catalog] URL final após redirect:", response.url)
      console.log("[Catalog] Headers:", Object.fromEntries(response.headers.entries()))

      const responseText = await response.text()

      console.log("[Catalog] Resposta bruta:")
      console.log(responseText)

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`)
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("[Catalog] Erro ao converter resposta para JSON:", parseError)
        throw new Error("A resposta não é um JSON válido")
      }

      console.log("[Catalog] JSON convertido:", data)

      if (!data.products) {
        console.error("[Catalog] Campo 'products' não encontrado no retorno:", data)
        throw new Error("Formato de dados inválido: 'products' não encontrado")
      }

      const formattedProducts = data.products.map((p: GoogleProduct, index: number) => {
        const rawCategory = p.categoria?.toLowerCase().trim()
        const category =
          rawCategory && rawCategory !== ""
            ? (rawCategory as ProductCategory)
            : "todos"

        return {
          id: `sheet-${index}`,
          name: p.nome,
          images: [p.imagem && p.imagem.trim() !== "" ? p.imagem : placeholderImage],
          category,
          price: p.valorVenda,
        }
      })

      console.log("[Catalog] Produtos formatados:", formattedProducts)

      setProducts(formattedProducts)
    } catch (err) {
      console.error("[Catalog] Erro detalhado ao carregar produtos:", err)

      if (err instanceof Error) {
        console.error("[Catalog] Mensagem do erro:", err.message)
        console.error("[Catalog] Stack:", err.stack)
      }

      setError(true)
    } finally {
      setIsLoading(false)
    }
  }

  fetchProducts()
}, [])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Se a categoria do produto for "todos", ele aparece em qualquer categoria selecionada 
      // OU se a categoria ativa for "todos", mostra tudo.
      const matchesCategory = 
        activeCategory === "todos" || 
        p.category === activeCategory;
        
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, products]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl md:text-3xl font-bold tracking-[0.15em] text-foreground uppercase">
            Uze Bless
          </Link>
          <nav className="flex items-center gap-6">
            <a href="#pecas" className="font-body text-xs tracking-[0.2em] uppercase text-secondary hover:text-foreground transition-colors">
              Peças
            </a>
            <a href="#sobre" className="font-body text-xs tracking-[0.2em] uppercase text-secondary hover:text-foreground transition-colors">
              Sobre
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground px-4 py-2 font-body text-xs tracking-[0.15em] uppercase hover:bg-secondary transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Contato
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden mt-[60px]">
        <img src={heroImage} alt="Coleção Uze Bless" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/40" />
        <div className="relative z-10 text-center px-6">
          <p className="font-body text-xs tracking-[0.4em] uppercase text-primary-foreground/80 mb-4 animate-fade-in-up">
            Semijoias exclusivas
          </p>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-primary-foreground tracking-wider animate-fade-in-up">
            Uze Bless
          </h2>
          <div className="w-16 h-px bg-gold mx-auto my-6 animate-fade-in-up" />
          <p className="font-body text-sm md:text-base text-primary-foreground/80 tracking-widest uppercase animate-fade-in-up">
            Elegância que abençoa
          </p>
          <a
            href="#pecas"
            className="inline-block mt-10 border border-primary-foreground/50 text-primary-foreground px-8 py-3 font-body text-xs tracking-[0.2em] uppercase hover:bg-primary-foreground hover:text-primary transition-all duration-300 animate-fade-in-up"
          >
            Ver Coleção
          </a>
        </div>
      </section>

      {/* Products */}
      <section id="pecas" className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-secondary mb-3">Coleção</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground tracking-wide">Nossas Peças</h2>
            <div className="w-12 h-px bg-gold mx-auto mt-4" />
          </div>

          {/* Search & Filter */}
          <div className="max-w-xl mx-auto mb-10 space-y-5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <input
                type="text"
                placeholder="Buscar peças..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted border border-border pl-11 pr-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-2 font-body text-xs tracking-[0.15em] uppercase border transition-colors ${
                    activeCategory === cat.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-secondary border-border hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Logic for States: Loading, Error, or Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-gold mb-4" />
              <p className="font-body text-sm text-secondary tracking-widest uppercase">Carregando catálogo...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="w-10 h-10 text-destructive mb-4" />
              <p className="font-body text-sm text-secondary">Não foi possível carregar os produtos.<br/>Tente novamente em instantes.</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.images[0]}
                  name={product.name}
                  price={product.price}
                  whatsappNumber={WHATSAPP_NUMBER}
                />
              ))}
            </div>
          ) : (
            <p className="text-center font-body text-sm text-secondary py-16">
              Nenhuma peça encontrada para os critérios selecionados.
            </p>
          )}
        </div>
      </section>

      {/* About */}
      <section id="sobre" className="py-20 bg-muted">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-secondary mb-3">Sobre</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground tracking-wide mb-8">Uze Bless</h2>
          <div className="w-12 h-px bg-gold mx-auto mb-8" />
          <p className="font-body text-sm leading-relaxed text-secondary">
            A Uze Bless nasceu do desejo de oferecer semijoias que combinam sofisticação e acessibilidade. 
            Cada peça é selecionada com cuidado para trazer elegância ao seu dia a dia. 
            Trabalhamos com materiais de alta qualidade e acabamento impecável.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre as peças da Uze Bless!")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-10 bg-primary text-primary-foreground px-8 py-3 font-body text-xs tracking-[0.2em] uppercase hover:bg-secondary transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Fale Conosco
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-display text-2xl tracking-[0.15em] mb-4">Uze Bless</h3>
          <p className="font-body text-xs tracking-widest uppercase text-primary-foreground/60 mb-6">
            Semijoias com bênção e estilo
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
          <p className="font-body text-xs text-primary-foreground/40">© 2026 Uze Bless. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index; 