
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-food-brown text-white mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Restaurant Info */}
          <div>
            <h3 className="font-display text-xl mb-4">QuickDish</h3>
            <p className="mb-2">O melhor sabor, direto na sua mesa.</p>
            <p className="mb-2">Av. Exemplo, 1234 - Centro</p>
            <p>Telefone: (11) 9876-5432</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-xl mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-primary transition-colors">
                  Cardápio
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary transition-colors">
                  Carrinho
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-primary transition-colors">
                  Área Administrativa
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-display text-xl mb-4">Horários</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Segunda - Sexta:</span>
                <span>11:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sábado:</span>
                <span>10:00 - 23:00</span>
              </li>
              <li className="flex justify-between">
                <span>Domingo:</span>
                <span>10:00 - 21:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p>© {new Date().getFullYear()} QuickDish. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
