
import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductList from '../components/menu/ProductList';
import { Product } from '../context/CartContext';
import { supabase } from '../hooks/useAuth';

const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // This would be replaced with actual Supabase query once connected
        // For now, using dummy data
        const dummyProducts: Product[] = [
          {
            id: '1',
            name: 'Hambúrguer Clássico',
            description: 'Pão brioche, 180g de carne, queijo cheddar, alface, tomate e molho especial',
            price: 28.90,
            category: 'Hambúrgueres',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '2',
            name: 'Pizza Margherita',
            description: 'Molho de tomate, mussarela, manjericão fresco e azeite de oliva',
            price: 42.90,
            category: 'Pizzas',
            image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '3',
            name: 'Salada Caesar',
            description: 'Alface romana, croutons, parmesão, frango grelhado e molho caesar',
            price: 24.90,
            category: 'Saladas',
            image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '4',
            name: 'Pasta Carbonara',
            description: 'Espaguete, pancetta, ovo, queijo pecorino e pimenta preta',
            price: 36.50,
            category: 'Massas',
            image: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '5',
            name: 'Hambúrguer Vegetariano',
            description: 'Pão integral, hambúrguer de grão-de-bico, rúcula, tomate e maionese vegana',
            price: 26.90,
            category: 'Hambúrgueres',
            image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '6',
            name: 'Pizza Pepperoni',
            description: 'Molho de tomate, mussarela e pepperoni',
            price: 44.90,
            category: 'Pizzas',
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '7',
            name: 'Água Mineral',
            description: 'Garrafa 500ml',
            price: 5.00,
            category: 'Bebidas',
            image: 'https://images.unsplash.com/photo-1546520057-a59c8dcde13b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '8',
            name: 'Refrigerante',
            description: 'Lata 350ml - Coca-Cola, Guaraná ou Sprite',
            price: 6.00,
            category: 'Bebidas',
            image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '9',
            name: 'Suco Natural',
            description: 'Copo 300ml - Laranja, Limão ou Abacaxi',
            price: 8.50,
            category: 'Bebidas',
            image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setProducts(dummyProducts);
          setLoading(false);
        }, 500);
        
        // In a real app with Supabase, you would do:
        // const { data, error } = await supabase
        //   .from('products')
        //   .select('*')
        //   .order('category');
        // if (error) throw error;
        // setProducts(data);
        
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Erro ao carregar produtos. Por favor, tente novamente.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-6">Nosso Cardápio</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-white py-2 px-4 rounded"
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          <ProductList products={products} />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Menu;
