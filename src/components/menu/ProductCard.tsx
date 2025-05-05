
import React from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Product, useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items, addItem, removeItem, updateQuantity } = useCart();
  
  const cartItem = items.find(item => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  
  const handleAddToCart = () => {
    addItem(product);
  };
  
  const handleRemoveFromCart = () => {
    if (quantity === 1) {
      removeItem(product.id);
    } else if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    }
  };
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };
  
  return (
    <div className="product-card bg-white rounded-lg overflow-hidden shadow-md">
      <div className="h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-2 h-10">
          {product.description}
        </p>
        <div className="flex justify-between items-center mt-3">
          <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
          
          {quantity > 0 ? (
            <div className="flex items-center">
              <button 
                onClick={handleRemoveFromCart}
                className="bg-secondary p-1 rounded-md hover:bg-secondary/80 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3">{quantity}</span>
              <button 
                onClick={handleAddToCart}
                className="bg-primary text-white p-1 rounded-md hover:bg-primary/80 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAddToCart}
              className="flex items-center space-x-2 bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/80 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
