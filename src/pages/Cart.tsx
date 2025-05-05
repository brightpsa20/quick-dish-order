
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const Cart = () => {
  const { items } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-6">Seu Carrinho</h1>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 max-w-lg mx-auto text-center">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-medium mb-3">Seu carrinho está vazio</h2>
            <p className="text-muted-foreground mb-6">
              Parece que você ainda não adicionou nenhum item ao seu carrinho.
            </p>
            <Link 
              to="/menu"
              className="bg-primary text-white py-3 px-6 rounded-lg inline-block hover:bg-primary/90 transition-colors"
            >
              Ver Cardápio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {items.map(item => (
                <CartItem key={item.product.id} item={item} />
              ))}
              
              <div className="mt-6">
                <Link 
                  to="/menu" 
                  className="text-primary hover:text-primary/80 font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continuar Comprando
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
