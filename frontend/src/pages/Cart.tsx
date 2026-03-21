import { Link } from "react-router-dom";
import { MessageCircle, Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { WHATSAPP_NUMBER } from "@/data/products";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart();

  const buildWhatsAppMessage = () => {
    const productList = items.map(
      (item) => `• ${item.product.name} (x${item.quantity}) - ${item.product.price}`,
    );

    const imageList = items
      .map((item) => {
        const productImage = item.product.images.find((image) => image !== PLACEHOLDER_IMAGE);

        if (!productImage) return null;

        return `• ${item.product.name}: ${productImage}`;
      })
      .filter(Boolean);

    return encodeURIComponent(
      [
        "Olá! Tenho interesse nestes produtos:",
        "",
        ...productList,
        imageList.length > 0 ? "" : undefined,
        imageList.length > 0 ? "Imagens dos produtos:" : undefined,
        ...(imageList as string[]),
      ]
        .filter(Boolean)
        .join("\n"),
    );
  };

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl md:text-3xl font-bold tracking-[0.15em] text-foreground uppercase">
            Uze Bless
          </Link>
        </div>
      </header>

      <div className="pt-[80px] pb-20">
        <div className="container mx-auto px-6 py-4">
          <Link to="/#pecas" className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-secondary hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Continuar comprando
          </Link>
        </div>

        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-secondary mb-3">Seu</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground tracking-wide">Carrinho</h1>
            <div className="w-12 h-px bg-gold mx-auto mt-4" />
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-border mx-auto mb-6" />
              <p className="font-body text-sm text-secondary mb-6">Seu carrinho está vazio.</p>
              <Link
                to="/#pecas"
                className="inline-block border border-foreground text-foreground px-8 py-3 font-body text-xs tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-all"
              >
                Ver Peças
              </Link>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 md:gap-6 border-b border-border pb-6">
                    <Link to={`/produto/${item.product.id}`} className="shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-24 h-24 md:w-32 md:h-32 object-cover bg-muted"
                      />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link to={`/produto/${item.product.id}`}>
                          <h3 className="font-display text-lg md:text-xl font-semibold tracking-wide text-foreground">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="font-body text-sm text-secondary mt-1">{item.product.price}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 border border-border flex items-center justify-center hover:border-foreground transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 border border-border flex items-center justify-center hover:border-foreground transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-secondary hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={clearCart}
                  className="font-body text-xs tracking-[0.15em] uppercase text-secondary hover:text-foreground transition-colors"
                >
                  Limpar carrinho
                </button>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-body text-xs tracking-[0.2em] uppercase hover:bg-secondary transition-colors w-full sm:w-auto"
                >
                  <MessageCircle className="w-4 h-4" />
                  Solicitar via WhatsApp ({totalItems} {totalItems === 1 ? "item" : "itens"})
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
