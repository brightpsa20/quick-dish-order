
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="font-display text-2xl text-primary font-bold">Quick<span className="text-food-brown">Dish</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`font-medium ${isActive('/') ? 'text-primary' : 'text-foreground hover:text-primary'}`}
          >
            Home
          </Link>
          <Link 
            to="/menu" 
            className={`font-medium ${isActive('/menu') ? 'text-primary' : 'text-foreground hover:text-primary'}`}
          >
            Cardápio
          </Link>
          <Link 
            to="/cart" 
            className="relative"
          >
            <ShoppingCart 
              className={`w-6 h-6 ${isActive('/cart') ? 'text-primary' : 'text-foreground hover:text-primary'}`} 
            />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <Link to="/cart" className="mr-4 relative">
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="container mx-auto px-4 py-2">
            <Link 
              to="/" 
              className={`block py-3 text-lg ${isActive('/') ? 'text-primary' : 'text-foreground'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/menu" 
              className={`block py-3 text-lg ${isActive('/menu') ? 'text-primary' : 'text-foreground'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Cardápio
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
