
import React from 'react';
import { MessageCirclePlus, Menu } from 'lucide-react';

interface HeaderProps {
  onNewChat: () => void;
  onMenuClick: () => void; // Restored sidebar trigger
  user: { name: string; initial: string; photoURL?: string } | null;
  translations: any;
}

const Header: React.FC<HeaderProps> = ({ onNewChat, onMenuClick, user, translations }) => {
  const t = translations.header;
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#FAFAFA]/90 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-50 transition-all duration-300 border-b border-transparent">
      
      {/* Left Side: Sidebar Toggle / User Info */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Sidebar Trigger (Hamburger) */}
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
          title="Menu"
        >
          <Menu size={20} strokeWidth={2.5} />
        </button>

        {/* User Info (If Logged In) */}
        {user && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
             {/* Circular Avatar */}
             <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-200 border-2 border-white overflow-hidden">
                {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    user.initial
                )}
             </div>
             <div className="hidden sm:block">
                 <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">{t.welcome}</p>
                 <p className="text-xs font-bold text-gray-900 leading-none">{user.name}</p>
             </div>
          </div>
        )}
      </div>
      
      {/* Right Side: New Chat */}
      <button 
        onClick={onNewChat}
        className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center hover:bg-white bg-white/50 border border-gray-200/50 rounded-full transition-all text-gray-600 active:scale-95 shadow-sm hover:shadow-md hover:border-gray-200 hover:text-[#7C3AED]"
        title={t.newChat}
      >
        <MessageCirclePlus size={18} strokeWidth={2.5} />
      </button>
    </header>
  );
};

export default Header;
