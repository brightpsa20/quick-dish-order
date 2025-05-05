
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';
import { Product } from '../../context/CartContext';

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Extract unique categories from products
  const categories = [...new Set(products.map(product => product.category))];
  
  // Filter products by category
  const filteredProducts = activeCategory
    ? products.filter(product => product.category === activeCategory)
    : products;
  
  return (
    <div>
      <CategoryFilter 
        categories={categories} 
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
