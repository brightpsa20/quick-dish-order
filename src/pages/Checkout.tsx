
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CartSummary from '../components/cart/CartSummary';
import { useCart } from '../context/CartContext';
import { sendOrderToWhatsApp, CheckoutFormData } from '../utils/whatsapp';
import { useOpeningHours } from '../hooks/useOpeningHours';
import { useToast } from '../hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { isOpen, currentStatus } = useOpeningHours();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    deliveryOption: 'pickup',
    paymentMethod: 'pix',
    changeNeeded: false,
  });
  
  const [changeAmount, setChangeAmount] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pixKey, setPixKey] = useState<string>('11998765432'); // This would come from your restaurant settings
  const [whatsappNumber, setWhatsappNumber] = useState<string>('5511998765432'); // This would come from your restaurant settings
  
  // Verificar se o restaurante está aberto ao entrar na página
  useEffect(() => {
    if (!isOpen) {
      toast({
        variant: "destructive",
        title: "Restaurante fechado",
        description: "Não é possível realizar pedidos fora do horário de funcionamento.",
        action: (
          <AlertTriangle className="h-4 w-4" />
        )
      });
    }
  }, [isOpen, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
    
    if (!checked) {
      setChangeAmount('');
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (formData.deliveryOption === 'delivery' && !formData.address?.trim()) {
      newErrors.address = 'Endereço é obrigatório para entrega';
    }
    
    if (formData.paymentMethod === 'cash' && formData.changeNeeded) {
      if (!changeAmount || parseFloat(changeAmount) <= subtotal) {
        newErrors.changeAmount = 'Valor para troco deve ser maior que o total';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se o restaurante está aberto
    if (!isOpen) {
      toast({
        variant: "destructive",
        title: "Pedido não permitido",
        description: "O restaurante está fechado no momento. Volte durante nosso horário de funcionamento.",
      });
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    // For cash payment with change
    let finalFormData = { ...formData };
    if (formData.paymentMethod === 'cash' && formData.changeNeeded) {
      finalFormData.changeAmount = parseFloat(changeAmount);
    }
    
    // Format cart items for WhatsApp message
    const orderItems = items.map(item => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      note: item.note
    }));
    
    // Send order via WhatsApp
    sendOrderToWhatsApp(
      whatsappNumber,
      orderItems,
      finalFormData,
      subtotal
    );
    
    // Clear cart and redirect to success page
    // In a real app, you would save the order to Supabase here
    clearCart();
    navigate('/');
  };
  
  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    alert('Chave PIX copiada!');
  };
  
  const formatCurrency = (value: string): string => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Convert to number and format
    if (digits) {
      const number = parseInt(digits, 10) / 100;
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(number);
    }
    
    return '';
  };
  
  const handleChangeAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow only numbers and format as currency
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setChangeAmount(value);
    }
  };
  
  // Redirect to menu if cart is empty
  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/menu');
    }
  }, [items, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-6">Finalizar Pedido</h1>
        
        {!isOpen && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p className="font-medium">O restaurante está fechado no momento.</p>
            </div>
            <p className="mt-1 text-sm">Não é possível realizar pedidos fora do horário de funcionamento.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleSubmit}>
                {/* Customer Information */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Informações do Cliente</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-md ${errors.name ? 'border-destructive' : 'border-input'}`}
                      placeholder="Seu nome completo"
                      disabled={!isOpen}
                    />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                  </div>
                </div>
                
                {/* Delivery Options */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Opções de Entrega</h2>
                  
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="pickup"
                        name="deliveryOption"
                        value="pickup"
                        checked={formData.deliveryOption === 'pickup'}
                        onChange={handleRadioChange}
                        className="mr-2"
                        disabled={!isOpen}
                      />
                      <label htmlFor="pickup">Retirar no Local</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="delivery"
                        name="deliveryOption"
                        value="delivery"
                        checked={formData.deliveryOption === 'delivery'}
                        onChange={handleRadioChange}
                        className="mr-2"
                        disabled={!isOpen}
                      />
                      <label htmlFor="delivery">Entrega</label>
                    </div>
                    
                    {formData.deliveryOption === 'delivery' && (
                      <div className="mt-3 pl-6">
                        <label htmlFor="address" className="block text-sm font-medium mb-1">
                          Endereço Completo
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          value={formData.address || ''}
                          onChange={handleInputChange}
                          rows={3}
                          className={`w-full p-3 border rounded-md ${errors.address ? 'border-destructive' : 'border-input'}`}
                          placeholder="Rua, número, complemento, bairro, cidade"
                          disabled={!isOpen}
                        />
                        {errors.address && (
                          <p className="text-destructive text-sm mt-1">{errors.address}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Payment Methods */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Forma de Pagamento</h2>
                  
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="pix"
                        name="paymentMethod"
                        value="pix"
                        checked={formData.paymentMethod === 'pix'}
                        onChange={handleRadioChange}
                        className="mr-2"
                        disabled={!isOpen}
                      />
                      <label htmlFor="pix">PIX</label>
                    </div>
                    
                    {formData.paymentMethod === 'pix' && (
                      <div className="mt-2 pl-6 p-4 bg-secondary rounded-md">
                        <p className="text-sm mb-2">Chave PIX:</p>
                        <div className="flex">
                          <input
                            type="text"
                            value={pixKey}
                            readOnly
                            className="flex-grow p-2 border rounded-l-md bg-white"
                            disabled={!isOpen}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(pixKey);
                              toast({ description: "Chave PIX copiada!" });
                            }}
                            className="bg-primary text-white px-4 py-2 rounded-r-md disabled:opacity-50"
                            disabled={!isOpen}
                          >
                            Copiar
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Envie o comprovante pelo WhatsApp após finalizar o pedido.
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cash"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleRadioChange}
                        className="mr-2"
                        disabled={!isOpen}
                      />
                      <label htmlFor="cash">Dinheiro</label>
                    </div>
                    
                    {formData.paymentMethod === 'cash' && (
                      <div className="mt-2 pl-6">
                        <div className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            id="changeNeeded"
                            name="changeNeeded"
                            checked={formData.changeNeeded}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                            disabled={!isOpen}
                          />
                          <label htmlFor="changeNeeded">Preciso de troco</label>
                        </div>
                        
                        {formData.changeNeeded && (
                          <div>
                            <label htmlFor="changeAmount" className="block text-sm font-medium mb-1">
                              Troco para quanto?
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                R$
                              </span>
                              <input
                                type="text"
                                id="changeAmount"
                                value={changeAmount}
                                onChange={handleChangeAmountInput}
                                className={`w-full p-3 pl-10 border rounded-md ${errors.changeAmount ? 'border-destructive' : 'border-input'}`}
                                placeholder="0,00"
                                disabled={!isOpen}
                              />
                            </div>
                            {errors.changeAmount && (
                              <p className="text-destructive text-sm mt-1">{errors.changeAmount}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isOpen}
                >
                  {isOpen ? 'Finalizar e Enviar Pedido' : 'Restaurante Fechado'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CartSummary showCheckoutButton={false} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
