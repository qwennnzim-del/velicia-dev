import React from 'react';
import { Sparkles } from 'lucide-react';

interface DashboardProps {
    onModelSelect: (type: 'text' | 'image') => void;
    onPromptSelect?: (text: string) => void;
    translations: any;
}

const Dashboard: React.FC<DashboardProps> = ({ onModelSelect, onPromptSelect, translations }) => {
  const t = translations.dashboard;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-700 w-full max-w-4xl mx-auto">
      
      {/* Optimized Logo */}
      <div className="mb-6 transform hover:scale-105 transition-transform duration-500">
        <img src="/logo-app.png" alt="Velicia Logo" className="h-24 w-auto object-contain drop-shadow-sm" />
      </div>
      
      <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">{t.welcome}</h2>
      <p className="text-gray-500 max-w-md mb-10 text-base leading-relaxed font-medium">
        {t.subtitle}
      </p>

    </div>
  );
};

export default Dashboard;