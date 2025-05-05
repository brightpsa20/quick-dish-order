
import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  activeCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="overflow-x-auto py-4">
      <div className="flex space-x-2 min-w-max">
        <button
          onClick={() => onSelectCategory(null)}
          className={`category-pill ${activeCategory === null ? 'active' : 'inactive'}`}
        >
          Todos
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`category-pill ${activeCategory === category ? 'active' : 'inactive'}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
