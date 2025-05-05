
import { useState, useEffect } from 'react';

interface OpeningHoursType {
  [day: string]: string;
}

export const useOpeningHours = () => {
  // Definindo os horários de funcionamento
  const openingHours: OpeningHoursType = {
    'Segunda-feira': '11:00 - 22:00',
    'Terça-feira': '11:00 - 22:00',
    'Quarta-feira': '11:00 - 22:00',
    'Quinta-feira': '11:00 - 22:00',
    'Sexta-feira': '11:00 - 22:00',
    'Sábado': '10:00 - 23:00',
    'Domingo': '10:00 - 21:00'
  };

  // Estado para armazenar se o restaurante está aberto
  const [isOpen, setIsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');

  // Função para verificar se o restaurante está aberto
  const checkIfOpen = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 é domingo, 1 é segunda, etc.
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 60 + minute; // converte para minutos desde meia-noite

    // Mapeia o dia da semana para o nome em português
    const dayNames = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    const dayName = dayNames[dayOfWeek];
    
    // Obtém o horário para o dia atual
    const hours = openingHours[dayName];
    
    if (!hours) {
      setIsOpen(false);
      setCurrentStatus('Fechado');
      return false;
    }

    // Analisa o horário de funcionamento
    const [openTime, closeTime] = hours.split(' - ');
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);
    
    const openingTime = openHour * 60 + openMinute;
    const closingTime = closeHour * 60 + closeMinute;
    
    // Verifica se o horário atual está dentro do período de funcionamento
    const isCurrentlyOpen = currentTime >= openingTime && currentTime < closingTime;
    
    setIsOpen(isCurrentlyOpen);
    setCurrentStatus(isCurrentlyOpen ? 'Aberto agora' : 'Fechado');
    
    return isCurrentlyOpen;
  };

  // Verificar ao carregar o componente e a cada minuto
  useEffect(() => {
    checkIfOpen();
    
    // Atualiza a cada minuto
    const interval = setInterval(checkIfOpen, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    isOpen,
    currentStatus,
    openingHours,
    checkIfOpen
  };
};
