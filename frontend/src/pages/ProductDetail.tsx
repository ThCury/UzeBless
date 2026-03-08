import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, MessageCircle, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/data/products";
import { fetchCatalogProducts, type CatalogProduct } from "@/services/products";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(false);

        const products = await fetchCatalogProducts();
        const found = products.find((p) => p.id === id) ?? null;
        setProduct(found);
      } catch (err) {
        console.error("[ProductDetail] Erro ao carregar produto:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const resetZoom = () => {
    setZoomed(false);
    setDragPos({ x: 0, y: 0 });
  };

  const handlePrev = () => {
    if (!product) return;
    resetZoom();
    setCurrentIndex((i) => (i > 0 ? i - 1 : product.images.length - 1));
  };

  const handleNext = () => {
    if (!product) return;
    resetZoom();
    setCurrentIndex((i) => (i < product.images.length - 1 ? i + 1 : 0));
  };

  const toggleZoom = () => {
    if (zoomed) resetZoom();
    else setZoomed(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!zoomed) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    dragOffset.current = { ...dragPos };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !zoomed) return;
    setDragPos({
      x: dragOffset.current.x + (e.clientX - dragStart.current.x),
      y: dragOffset.current.y + (e.clientY - dragStart.current.y),
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
          <p className="font-body text-sm text-secondary">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-3">
          <AlertCircle className="w-8 h-8 text-destructive" />
          <p className="font-body text-sm text-secondary">N�o foi poss�vel carregar o produto.</p>
          <Link to="/" className="font-body text-sm text-secondary hover:text-foreground transition-colors underline">
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Produto n�o encontrado</h1>
          <Link to="/" className="font-body text-sm text-secondary hover:text-foreground transition-colors underline">
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  const message = encodeURIComponent(`Ol�! Tenho interesse na pe�a: ${product.name} - ${product.price}`);
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl md:text-3xl font-bold tracking-[0.15em] text-foreground uppercase">
            Uze Bless
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground px-4 py-2 font-body text-xs tracking-[0.15em] uppercase hover:bg-secondary transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Contato
          </a>
        </div>
      </header>

      <div className="pt-[80px] pb-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 py-4">
          <Link to="/#pecas" className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-secondary hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar às peças
          </Link>
        </div>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Gallery */}
            <div>
              {/* Main image */}
              <div
                className="relative w-full aspect-square bg-muted overflow-hidden select-none mb-4"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: zoomed ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
                onClick={() => {
                  if (!isDragging || (dragPos.x === dragOffset.current.x && dragPos.y === dragOffset.current.y)) toggleZoom();
                }}
              >
                <img
                  src={product.images[currentIndex]}
                  alt={`${product.name} - Foto ${currentIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{
                    transform: zoomed ? `scale(2.5) translate(${dragPos.x / 2.5}px, ${dragPos.y / 2.5}px)` : "scale(1)",
                  }}
                  draggable={false}
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleZoom();
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-primary/70 text-primary-foreground flex items-center justify-center hover:bg-primary transition-colors"
                >
                  {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                </button>

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary/70 text-primary-foreground flex items-center justify-center hover:bg-primary transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary/70 text-primary-foreground flex items-center justify-center hover:bg-primary transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        resetZoom();
                        setCurrentIndex(i);
                      }}
                      className={`shrink-0 w-20 h-20 overflow-hidden border-2 transition-colors ${
                        i === currentIndex ? "border-foreground" : "border-border hover:border-secondary"
                      }`}
                    >
                      <img src={img} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col justify-center">
              <p className="font-body text-xs tracking-[0.3em] uppercase text-secondary mb-3">Uze Bless</p>
              <h1 className="font-display text-4xl md:text-5xl font-light text-foreground tracking-wide mb-4">{product.name}</h1>
              <div className="w-12 h-px bg-gold mb-6" />
              <p className="font-display text-2xl text-foreground mb-8">{product.price}</p>

              {product.description && <p className="font-body text-sm leading-relaxed text-secondary mb-8">{product.description}</p>}

              {product.details && product.details.length > 0 && (
                <div className="mb-10">
                  <h3 className="font-body text-xs tracking-[0.2em] uppercase text-foreground mb-4">Detalhes</h3>
                  <ul className="space-y-2">
                    {product.details.map((detail, i) => (
                      <li key={i} className="font-body text-sm text-secondary flex items-center gap-2">
                        <span className="w-1 h-1 bg-gold rounded-full shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-body text-xs tracking-[0.2em] uppercase hover:bg-secondary transition-colors w-full md:w-auto"
              >
                <MessageCircle className="w-4 h-4" />
                Comprar via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
