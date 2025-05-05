
export interface CheckoutFormData {
  name: string;
  deliveryOption: 'pickup' | 'delivery';
  address?: string;
  paymentMethod: 'pix' | 'cash';
  changeNeeded?: boolean;
  changeAmount?: number;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  note?: string;
}

// Format currency as Brazilian Real
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Generates a WhatsApp message with order details
 */
export const generateOrderMessage = (
  orderItems: OrderItem[], 
  formData: CheckoutFormData, 
  subtotal: number
): string => {
  // Start with a greeting and client name
  let message = `🍽️ *NOVO PEDIDO* 🍽️\n\n`;
  message += `*Nome do cliente:* ${formData.name}\n`;
  
  // Add delivery information
  if (formData.deliveryOption === 'delivery' && formData.address) {
    message += `*Tipo:* Entrega\n`;
    message += `*Endereço:* ${formData.address}\n\n`;
  } else {
    message += `*Tipo:* Retirada\n\n`;
  }
  
  // List items
  message += `*ITENS DO PEDIDO:*\n`;
  orderItems.forEach((item) => {
    message += `• ${item.quantity}x ${item.name} - ${formatCurrency(item.price * item.quantity)}\n`;
    if (item.note) {
      message += `   _Obs: ${item.note}_\n`;
    }
  });
  
  // Add payment information
  message += `\n*PAGAMENTO:*\n`;
  message += `*Método:* ${formData.paymentMethod === 'pix' ? 'PIX' : 'Dinheiro'}\n`;
  
  if (formData.paymentMethod === 'cash' && formData.changeNeeded && formData.changeAmount) {
    message += `*Troco para:* ${formatCurrency(formData.changeAmount)}\n`;
    message += `*Troco a ser dado:* ${formatCurrency(formData.changeAmount - subtotal)}\n`;
  }
  
  // Add total
  message += `\n*TOTAL: ${formatCurrency(subtotal)}*`;
  
  return encodeURIComponent(message);
};

/**
 * Opens WhatsApp with pre-filled order message
 */
export const sendOrderToWhatsApp = (
  phoneNumber: string, 
  orderItems: OrderItem[], 
  formData: CheckoutFormData, 
  subtotal: number
): void => {
  // Format phone number (remove non-digits)
  const formattedPhone = phoneNumber.replace(/\D/g, '');
  
  // Generate message
  const message = generateOrderMessage(orderItems, formData, subtotal);
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
  
  // Open WhatsApp in a new tab
  window.open(whatsappUrl, '_blank');
};
