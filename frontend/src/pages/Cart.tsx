import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { WHATSAPP_NUMBER } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const parsePrice = (price: string) => {
  const normalizedValue = price.replace(/[^\d,]/g, "").replace(",", ".");
  return Number(normalizedValue) || 0;
};

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart();

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + parsePrice(item.product.price) * item.quantity,
        0,
      ),
    [items],
  );

  const whatsappMessage = encodeURIComponent(
    [
      "Olá! Quero finalizar meu pedido com estes produtos:",
      "",
      ...items.map(
        (item) =>
          `- ${item.product.name} | Qtd: ${item.quantity} | ${item.product.price}`,
      ),
      "",
      `Total: ${formatBRL(total)}`,
    ].join("\n"),
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl md:text-3xl font-bold tracking-[0.15em] text-foreground uppercase">
            Uze Bless
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/#pecas"
              className="font-body text-xs tracking-[0.2em] uppercase text-secondary hover:text-foreground transition-colors"
            >
              Peças
            </Link>
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 font-body text-xs tracking-[0.15em] uppercase">
              <ShoppingBag className="w-4 h-4" />
              {totalItems} item{totalItems === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      </header>

      <div className="pt-[80px] pb-20">
        <div className="container mx-auto px-6 py-4">
          <Link to="/#pecas" className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-secondary hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar às peças
          </Link>
        </div>

        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-secondary mb-3">Seu pedido</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground tracking-wide">Carrinho</h1>
            <div className="w-12 h-px bg-gold mx-auto mt-4" />
          </div>

          {items.length === 0 ? (
            <div className="max-w-2xl mx-auto bg-muted px-8 py-14 text-center">
              <ShoppingBag className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h2 className="font-display text-2xl text-foreground mb-3">Seu carrinho está vazio</h2>
              <p className="font-body text-sm text-secondary mb-8">
                Adicione suas peças favoritas na vitrine para montar seu pedido.
              </p>
              <Link
                to="/#pecas"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-body text-xs tracking-[0.2em] uppercase hover:bg-secondary transition-colors"
              >
                Ver coleção
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_0.9fr] gap-8 lg:gap-12 items-start">
              <div className="space-y-5">
                {items.map((item) => (
                  <article key={item.product.id} className="bg-muted p-4 md:p-5">
                    <div className="flex flex-col sm:flex-row gap-5">
                      <Link to={`/produto/${item.product.id}`} className="shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full sm:w-32 aspect-square object-cover"
                        />
                      </Link>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <Link
                              to={`/produto/${item.product.id}`}
                              className="font-display text-2xl text-foreground tracking-wide"
                            >
                              {item.product.name}
                            </Link>
                            <p className="font-body text-sm text-secondary mt-2">{item.product.price}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.product.id)}
                            className="text-secondary hover:text-foreground transition-colors"
                            aria-label={`Remover ${item.product.name} do carrinho`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="inline-flex items-center border border-border">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-10 h-10 flex items-center justify-center text-secondary hover:text-foreground transition-colors"
                              aria-label={`Diminuir quantidade de ${item.product.name}`}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-body text-sm text-foreground">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center text-secondary hover:text-foreground transition-colors"
                              aria-label={`Aumentar quantidade de ${item.product.name}`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="font-body text-xs tracking-[0.15em] uppercase text-secondary">
                            Subtotal: {formatBRL(parsePrice(item.product.price) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="bg-muted p-6 md:p-8">
                <p className="font-body text-xs tracking-[0.3em] uppercase text-secondary mb-3">Resumo</p>
                <h2 className="font-display text-3xl text-foreground mb-6">Finalizar pedido</h2>

                <div className="space-y-4 border-y border-border py-5 mb-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-body text-sm text-secondary">Itens</span>
                    <span className="font-body text-sm text-foreground">{totalItems}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-body text-sm text-secondary">Total</span>
                    <span className="font-display text-2xl text-foreground">{formatBRL(total)}</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-body text-xs tracking-[0.2em] uppercase hover:bg-secondary transition-colors w-full mb-3"
                >
                  <MessageCircle className="w-4 h-4" />
                  Enviar pedido no WhatsApp
                </a>

                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full border border-border px-8 py-4 font-body text-xs tracking-[0.2em] uppercase text-secondary hover:text-foreground hover:border-foreground transition-colors"
                >
                  Limpar carrinho
                </button>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
