
import React from 'react';
import { Clock, MapPin, Phone, Info } from 'lucide-react';
import { useOpeningHours } from '../../hooks/useOpeningHours';

const HeroSection: React.FC = () => {
  const { isOpen, currentStatus, openingHours } = useOpeningHours();
  
  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg overflow-hidden shadow-md mb-8">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Store Info */}
          <div>
            <h1 className="text-4xl font-display font-bold mb-4">QuickDish</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Sabores autênticos, ingredientes frescos e atendimento excelente para uma experiência gastronômica inesquecível.
            </p>
            
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="text-primary h-5 w-5" />
              <span>Av. Exemplo, 1234 - Centro</span>
            </div>
            
            <div className="flex items-center space-x-2 mb-3">
              <Phone className="text-primary h-5 w-5" />
              <span>(11) 9876-5432</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="text-primary h-5 w-5" />
              <div>
                <span className={`font-medium ${isOpen ? 'text-green-600' : 'text-destructive'}`}>
                  {currentStatus}
                </span>
              </div>
            </div>
          </div>
          
          {/* Right Column: Opening Hours */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Clock className="text-primary h-5 w-5 mr-2" />
              <h2 className="text-xl font-semibold">Horários de Funcionamento</h2>
            </div>
            
            <div className="space-y-2">
              {Object.entries(openingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between">
                  <span className="font-medium">{day}</span>
                  <span>{hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
