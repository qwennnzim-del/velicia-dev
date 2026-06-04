import React from 'react';
import { X, MessageSquarePlus, Settings, CircleHelp, History, LogIn, LayoutGrid, Layers, CreditCard, BookOpen, Info, MessageSquare, User, Trash2, Instagram, Linkedin } from 'lucide-react';
import { ChatSession, UserProfile } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onNavigate: (sectionId: string) => void;
  
  // New Props
  history: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string, e: React.MouseEvent) => void;
  
  userProfile: UserProfile;
  
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenHelp: () => void;
  onLogin: () => void;
  translations: any; // Accept translations object
}

const Sidebar: React.FC<SidebarProps> = ({ 
    isOpen, onClose, onNewChat, onNavigate, 
    history, activeChatId, onSelectChat, onDeleteChat,
    userProfile,
    onOpenSettings, onOpenProfile, onOpenHelp, onLogin,
    translations
}) => {
  
  const handleNavigation = (id: string) => {
    onNavigate(id);
    onClose();
  };

  const t = translations.sidebar;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar Container */}
      <div className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col border-r border-gray-100`}>
        
        {/* Header Sidebar */}
        <div className="p-5 flex items-center justify-between">
           <div className="flex items-center gap-2">
                <img src="/logo-app.png" alt="Velicia Logo" className="h-8 w-auto object-contain" />
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
             <X size={20} />
           </button>
        </div>

        {/* Action Button */}
        <div className="px-4 mb-2">
            <button 
                onClick={() => {
                    onNewChat();
                    onClose();
                }}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-md hover:shadow-lg active:scale-95 group"
            >
                <MessageSquarePlus size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                <span className="font-semibold">{t.newChat}</span>
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-1 no-scrollbar">
            
            <div className="px-3 mb-2 mt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.nav}</span>
            </div>

            {/* Navigation Links */}
            <button onClick={() => handleNavigation('home')} className="sidebar-link"><LayoutGrid size={16} /> {t.home}</button>
            <button onClick={() => handleNavigation('features')} className="sidebar-link"><Layers size={16} /> {t.features}</button>
            <button onClick={() => handleNavigation('blog')} className="sidebar-link"><BookOpen size={16} /> {t.blog}</button>

            <div className="px-3 mb-2 mt-6 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.history}</span>
            </div>

            {/* Chat History List */}
            <div className="flex flex-col gap-1 pb-4">
                {history.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                        <History size={24} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-xs text-gray-400 font-medium">{t.emptyHistory}</p>
                    </div>
                ) : (
                    history.slice().reverse().map((session) => (
                        <div 
                            key={session.id} 
                            onClick={() => { onSelectChat(session.id); onClose(); }}
                            className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border border-transparent ${activeChatId === session.id ? 'bg-purple-50 border-purple-100 text-purple-900' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <MessageSquare size={16} className={`shrink-0 ${activeChatId === session.id ? 'text-purple-600' : 'text-gray-400'}`} />
                                <span className="text-sm font-medium truncate">{session.title}</span>
                            </div>
                            <button 
                                onClick={(e) => onDeleteChat(session.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))
                )}
            </div>
            
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-2">
            
            <button 
                onClick={onOpenProfile}
                className="flex items-center gap-3 w-full p-2.5 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl transition-all group"
            >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
                    {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-xs font-bold text-gray-900 truncate w-full text-left">{userProfile.name}</span>
                    <span className="text-[10px] text-gray-500 truncate w-full text-left">{userProfile.bio || t.welcome}</span>
                </div>
            </button>

            <div className="grid grid-cols-2 gap-2 mt-1">
                <button onClick={onOpenSettings} className="flex items-center justify-center gap-2 p-2.5 text-gray-600 bg-white border border-gray-200 hover:border-purple-300 hover:text-purple-600 rounded-xl font-bold text-xs transition-colors">
                    <Settings size={14} /> {t.settings}
                </button>
                <button onClick={onOpenHelp} className="flex items-center justify-center gap-2 p-2.5 text-gray-600 bg-white border border-gray-200 hover:border-purple-300 hover:text-purple-600 rounded-xl font-bold text-xs transition-colors">
                    <CircleHelp size={14} /> {t.info}
                </button>
            </div>

            <button 
                onClick={onLogin}
                className={`flex items-center justify-center gap-2 w-full p-3 rounded-xl font-bold text-sm transition-colors mt-1 ${userProfile.isLoggedIn ? 'text-red-600 hover:bg-red-50' : 'bg-black text-white hover:bg-gray-800 shadow-md'}`}
            >
                <LogIn size={16} /> {userProfile.isLoggedIn ? t.logout : t.login}
            </button>

            {/* Creator Social Links */}
            <div className="flex items-center justify-center gap-4 mt-2 pt-3 border-t border-gray-200/50">
                 <a href="https://www.linkedin.com/in/hezell-tech-72a7963b0" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0077b5] transition-colors">
                    <Linkedin size={16} />
                 </a>
                 <a href="https://www.instagram.com/account.hezell?igsh=MXczZXI3eW1nbHdmMQ==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E4405F] transition-colors">
                    <Instagram size={16} />
                 </a>
            </div>
            <div className="text-[9px] text-center text-gray-400 font-medium">
               Developed by M. Fariz Alfauzi
            </div>
        </div>

      </div>

      <style>{`
        .sidebar-link {
            @apply flex items-center gap-3 w-full p-2.5 text-gray-600 hover:bg-pink-50 hover:text-pink-700 rounded-xl font-medium text-sm transition-colors;
        }
      `}</style>
    </>
  );
};

export default Sidebar;