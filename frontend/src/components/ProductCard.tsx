import { Link } from "react-router-dom";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  price: string;
  whatsappNumber: string;
}

const ProductCard = ({ id, image, name, price, whatsappNumber }: ProductCardProps) => {
  const { addItem } = useCart();
  const message = encodeURIComponent(`Olá! Tenho interesse na peça: ${name} - ${price}`);
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product = products.find((p) => p.id === id);
    if (product) addItem(product);
  };

  return (
    <div className="group">
      <div className="relative overflow-hidden bg-muted mb-4">
        <Link to={`/produto/${id}`}>
          <img
            src={image}
            alt={name}
            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 pointer-events-none">
          <Link
            to={`/produto/${id}`}
            className="pointer-events-auto flex items-center gap-2 text-primary-foreground font-body text-sm font-medium tracking-widest uppercase"
          >
            Ver Detalhes
          </Link>
          <button
            onClick={handleAddToCart}
            className="pointer-events-auto flex items-center gap-2 text-primary-foreground font-body text-sm font-medium tracking-widest uppercase"
          >
            <ShoppingBag className="w-5 h-5" />
            Adicionar
          </button>
        </div>
      </div>
      <Link to={`/produto/${id}`}>
        <h3 className="font-display text-lg font-semibold tracking-wide text-foreground">{name}</h3>
      </Link>
      <p className="font-body text-sm text-secondary mt-1">{price}</p>
    </div>
  );
};

export default ProductCard;
