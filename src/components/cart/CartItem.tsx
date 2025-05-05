
import React, { useState } from 'react';
import { Plus, Minus, Trash } from 'lucide-react';
import { CartItem as CartItemType, useCart } from '../../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem, updateNote } = useCart();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [note, setNote] = useState(item.note || '');
  
  const handleQuantityIncrease = () => {
    updateQuantity(item.product.id, item.quantity + 1);
  };
  
  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    } else {
      removeItem(item.product.id);
    }
  };
  
  const handleRemoveItem = () => {
    removeItem(item.product.id);
  };
  
  const handleNoteSubmit = () => {
    updateNote(item.product.id, note);
    setIsAddingNote(false);
  };
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
          <img 
            src={item.product.image} 
            alt={item.product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between">
            <h3 className="font-semibold">{item.product.name}</h3>
            <button 
              onClick={handleRemoveItem} 
              className="text-gray-400 hover:text-destructive transition-colors"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">{item.product.description}</p>
          
          {item.note && !isAddingNote && (
            <div className="mt-1 mb-2">
              <p className="text-xs text-primary italic">
                Obs: {item.note}
                <button 
                  onClick={() => setIsAddingNote(true)} 
                  className="ml-2 text-muted-foreground underline"
                >
                  Editar
                </button>
              </p>
            </div>
          )}
          
          {isAddingNote && (
            <div className="mt-1 mb-3">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Adicionar observação (ex: sem cebola)"
                className="text-xs w-full p-2 border rounded"
                rows={2}
              />
              <div className="flex justify-end space-x-2 mt-1">
                <button 
                  onClick={() => setIsAddingNote(false)} 
                  className="text-xs text-muted-foreground"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleNoteSubmit} 
                  className="text-xs text-primary font-medium"
                >
                  Salvar
                </button>
              </div>
            </div>
          )}
          
          {!isAddingNote && !item.note && (
            <button 
              onClick={() => setIsAddingNote(true)} 
              className="text-xs text-primary mb-2 inline-block"
            >
              + Adicionar observação
            </button>
          )}
          
          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center">
              <button 
                onClick={handleQuantityDecrease}
                className="border rounded-l p-1 hover:bg-secondary transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="border-t border-b px-3 py-0.5">
                {item.quantity}
              </span>
              <button 
                onClick={handleQuantityIncrease}
                className="border rounded-r p-1 hover:bg-secondary transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            
            <div className="text-right">
              <p className="font-semibold">
                {formatPrice(item.product.price * item.quantity)}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.quantity > 1 && `${formatPrice(item.product.price)} cada`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
