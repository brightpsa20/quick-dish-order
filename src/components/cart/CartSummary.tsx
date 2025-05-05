
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({ showCheckoutButton = true }) => {
  const { items, subtotal } = useCart();
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium mb-2">Seu carrinho está vazio</h3>
        <p className="text-muted-foreground mb-4">
          Adicione alguns produtos para continuar.
        </p>
        <Link 
          to="/menu"
          className="bg-primary text-white py-2 px-4 rounded-lg inline-block hover:bg-primary/90 transition-colors"
        >
          Ver cardápio
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium border-b pb-4 mb-4">Resumo do pedido</h3>
      
      <div className="space-y-2 mb-4">
        {items.map(item => (
          <div key={item.product.id} className="flex justify-between">
            <span className="text-muted-foreground">
              {item.quantity}x {item.product.name}
            </span>
            <span>{formatCurrency(item.product.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
      </div>
      
      {showCheckoutButton && (
        <div className="mt-6">
          <Link
            to="/checkout"
            className="bg-primary text-white py-3 px-4 rounded-lg w-full inline-block text-center font-medium hover:bg-primary/90 transition-colors"
          >
            Finalizar Pedido
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
