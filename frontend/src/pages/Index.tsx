import { useEffect, useState, useMemo } from "react";
import { MessageCircle, Instagram, Search, ShoppingBag, Github, Linkedin, Loader2, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import { WHATSAPP_NUMBER, type ProductCategory } from "@/data/products";
import { useCatalogProducts } from "@/services/products";

import heroImage from "@/assets/wallpaper1.jpeg";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

const categories: { value: ProductCategory | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "colar", label: "Colares" },
  { value: "anel", label: "Anéis" },
  { value: "pulseira", label: "Pulseiras" },
  { value: "brinco", label: "Brincos" },
  { value: "kit", label: "Kits" },
  { value: "outros", label: "Outros" },
];

const Index = () => {
  const navigate = useNavigate();
  const { totalItems, addItem } = useCart();
  const { data: products = [], isLoading, error } = useCatalogProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "todos">("todos");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "todos" || p.category === activeCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const aHasRealImage = a.images[0] !== PLACEHOLDER_IMAGE;
        const bHasRealImage = b.images[0] !== PLACEHOLDER_IMAGE;

        if (aHasRealImage === bHasRealImage) return 0;
        return aHasRealImage ? -1 : 1;
      });
  }, [products, searchQuery, activeCategory]);

  const hasActiveFilters = searchQuery.trim() !== "" || activeCategory !== "todos";
  const visibleProducts =
    hasActiveFilters || showAllProducts ? filteredProducts : filteredProducts.slice(0, 10);
  const shouldShowViewAllButton =
    !hasActiveFilters && !showAllProducts && filteredProducts.length > 10;

  useEffect(() => {
    setShowAllProducts(false);
  }, [searchQuery, activeCategory]);

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
            <a href="#faq" className="font-body text-xs tracking-[0.2em] uppercase text-secondary hover:text-foreground transition-colors">
              Perguntas
            </a>
            <a href="#sobre" className="font-body text-xs tracking-[0.2em] uppercase text-secondary hover:text-foreground transition-colors">
              Sobre
            </a>
            <Link to="/carrinho" className="relative text-foreground hover:text-secondary transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-primary-foreground text-[10px] font-body font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
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
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-primary-foreground tracking-wider animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            Uze Bless
          </h2>
          <div className="w-16 h-px bg-gold mx-auto my-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }} />
          <p className="font-body text-sm md:text-base text-primary-foreground/80 tracking-widest uppercase animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            Seu look completo começa aqui
          </p>
          <a
            href="#pecas"
            className="inline-block mt-10 border border-primary-foreground/50 text-primary-foreground px-8 py-3 font-body text-xs tracking-[0.2em] uppercase hover:bg-primary-foreground hover:text-primary transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: "0.55s" }}
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
                className="w-full bg-muted border border-border pl-11 pr-4 py-3 font-body text-sm text-foreground placeholder:text-secondary/60 focus:outline-none focus:border-foreground transition-colors"
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

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-gold mb-4" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="w-10 h-10 text-destructive mb-4" />
              <p className="font-body text-sm text-secondary">Não foi possível carregar os produtos.<br />Tente novamente em instantes.</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 max-w-6xl mx-auto">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.images[0]}
                    name={product.name}
                    price={product.price}
                    onBuy={() => {
                      addItem(product);
                      navigate("/carrinho");
                    }}
                  />
                ))}
              </div>
              {shouldShowViewAllButton && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllProducts(true)}
                    className="inline-flex items-center justify-center border border-foreground px-8 py-3 font-body text-xs tracking-[0.2em] uppercase text-foreground hover:bg-foreground hover:text-background transition-all"
                  >
                    Ver todos
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center font-body text-sm text-secondary py-16">
              Nenhuma peça encontrada.
            </p>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground tracking-wide">
              Perguntas frequentes
            </h2>
            <div className="w-12 h-px bg-gold mx-auto mt-4" />
          </div>

          {[
            {
              question: "Qual é o material?",
              answer:
                "Trabalhamos com semijoias banhadas em 50 milésimos de prata, garantindo brilho, durabilidade e acabamento sofisticado. Além disso, todas as peças recebem um banho de verniz protetor, que ajuda a preservar o brilho por mais tempo e aumenta a resistência ao desgaste do uso diário.",
            },
            {
              question: "Pode causar alergia?",
              answer:
                "Não. Nossas peças são livres de níquel e consideradas hipoalergênicas. Isso significa que foram desenvolvidas para reduzir significativamente o risco de alergias, sendo confortáveis para a maioria das pessoas que possuem sensibilidade a metais comuns.",
            },
            {
              question: "Como comprar?",
              answer:
                "É muito simples. Basta entrar em contato conosco pelo WhatsApp ou pelo direct do Instagram. Nossa equipe irá te atender, tirar dúvidas sobre as peças disponíveis e ajudar você a escolher a semijoia perfeita.",
            },
            {
              question: "Frete",
              answer:
                "O envio das peças é feito após a confirmação do pedido. O valor do frete é por conta do cliente e pode variar de acordo com a cidade ou região de entrega. Informamos o valor exato no momento da compra.",
            },
          ].map((faq, index) => (
            <div key={index} className="border-b border-border py-4">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="font-body text-sm md:text-base text-foreground">
                  {faq.question}
                </span>
                <span className="text-secondary text-lg">
                  {openFaq === index ? "−" : "+"}
                </span>
              </button>

              {openFaq === index && (
                <p className="mt-3 text-sm text-secondary leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
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
        <div className="container mx-auto px-6 relative">
        {/* Centro */}
        <div className="flex flex-col items-center text-center gap-4">
          <h3 className="font-display text-2xl tracking-[0.15em]">Uze Bless</h3>

          <p className="font-body text-xs tracking-widest uppercase text-primary-foreground/60">
            Seu look completo começa aqui ✨
          </p>

          <div className="flex gap-4">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <a
              href="#"
              className="w-10 h-10 border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          <p className="font-body text-xs text-primary-foreground/40">
            © 2026 Uze Bless. Todos os direitos reservados.
          </p>
        </div>

        {/* Direita */}
        <div className="mt-8 md:mt-0 md:absolute md:right-6 md:bottom-0 flex flex-col items-center md:items-end text-center md:text-right gap-2">
          <p className="font-body text-xs text-primary-foreground/60">
            Desenvolvido por Thiago Cury
          </p>

          <div className="flex gap-3">
            <a
              href="https://github.com/ThCury"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-8 h-8 border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>

            <a
              href="https://www.linkedin.com/in/thiago-cury-freire-7b226a207/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>


    </div>
  );
};

export default Index;
