"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Search, PenTool, Image as ImageIcon, 
  FileText, Globe, Play, Menu, X, 
  ChevronDown, Star, Layout, Sparkles, Smartphone, Monitor, Chrome, Brain, Mail, Briefcase, Zap,
  Linkedin, Github, Twitter, Calendar, ArrowRight, BarChart3, ShieldCheck, ChevronUp, LogIn, Instagram, MapPin, GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/components/AppContext';

// --- TRANSLATIONS DATA ---
const TRANSLATIONS = {
  id: {
    nav: {
      langLabel: 'ID',
      features: 'Fitur',
      pricing: 'Harga',
      blog: 'Blog',
      about: 'Tentang',
      login: 'Masuk'
    },
    hero: {
      badge: 'Partner Cerdas Masa Depan',
      title1: 'Asisten Cerdas',
      title2: 'Indonesia',
      desc: 'Velicia dikembangkan untuk Masa Depan Nusantara dengan arsitektur Gen2. Efisiensi tinggi, penalaran mendalam, dan respon cepat.',
      startBtn: 'Mulai Sekarang',
      disclaimer: 'Gratis selamanya • Tanpa kartu kredit',
      mockupText: 'Halo! Ada yang bisa saya bantu hari ini?',
      mockupPrompt: 'Jelaskan kemampuan Gen2 kamu.',
      mockupResponse: 'Saya Velicia Gen2, asisten cerdas yang dirancang dengan penalaran dan efisiensi tingkat lanjut.',
      mockupPowered: 'Velicia Gen2 Engine'
    },
    blog: {
      title: 'Artikel & Pembaruan',
      readMore: 'Baca',
      viewAll: 'Lihat Semua',
      articles: [
        {
          id: 4,
          title: "Velicia Resmi Mengganti Library ke Gen2",
          desc: "Peningkatan performa, penalaran, dan kecepatan dengan arsitektur terbaru.",
          tag: "Teknologi"
        },
        {
          id: 101,
          title: "Update v1.2: Mode Suara (TTS) & File Reader",
          desc: "Fitur baru untuk analisis dokumen dan interaksi suara yang lebih natural.",
          tag: "Update"
        },
        {
          id: 0,
          title: "Visi Kedaulatan Digital",
          desc: "Velicia AI sebagai solusi mandiri untuk kebutuhan teknologi nasional.",
          tag: "Visi"
        }
      ]
    },
    profession: {
      title: 'Solusi Profesional',
      items: {
        'Entrepreneur': [
          { title: 'Intelijen Pasar', desc: 'Analisis pesaing & tren pasar.' },
          { title: 'Partner Strategis', desc: 'Solusi strategis tantangan bisnis.' },
          { title: 'Analisis Dokumen', desc: 'Ekstraksi poin kontrak & laporan.' },
          { title: 'Asisten Email', desc: 'Saran tanggapan kontekstual.' },
        ],
        'Konsultan': [
            { title: 'Presentasi Kilat', desc: 'Kerangka presentasi instan.' },
            { title: 'Analisis Data', desc: 'Wawasan dari data mentah.' },
        ],
        'Peneliti': [
            { title: 'Ringkasan Jurnal', desc: 'Pahami jurnal dalam sekejap.' },
            { title: 'Pencari Referensi', desc: 'Sumber kredibel & sitasi.' },
        ],
        'Pengembang': [
            { title: 'Generator Kode', desc: 'Boilerplate & fungsi kompleks.' },
            { title: 'AI Debugger', desc: 'Temukan & perbaiki bug.' },
        ],
        'Pemasaran': [
            { title: 'Copywriter', desc: 'Persuasive ad copy.' },
            { title: 'Campaign Ideas', desc: 'Brainstorming ide viral.' },
        ]
      }
    },
    team: {
      title: 'Tim Gen2 Kami',
      subtitle: 'Talenta muda terbaik yang membangun masa depan AI Indonesia.',
    },
    faq: {
      title: 'FAQ',
      items: [
        { q: 'Apa itu Velicia Gen2?', a: 'Upgrade arsitektur terbaru yang lebih cepat, lebih pintar dalam menalar, dan efisien.' },
        { q: 'Siapa pembuat Velicia AI?', a: 'Velicia Dikembangkan oleh Tim AI Engineer, SuperRinz adalah Developer Utama Atas Velicia AI.' },
        { q: 'Apakah gratis?', a: 'Ya, gratis selamanya untuk penggunaan personal. Tersedia paket Pro.' },
        { q: 'Cara kerja?', a: 'Menggunakan mesin AI mandiri yang dioptimalkan dengan pemahaman bahasa alami Gen2.' }
      ]
    },
    footer: {
      text: '© 2026 Velicia AI | SuperRinzDev Inc.'
    }
  },
  en: {
    nav: {
      langLabel: 'EN',
      features: 'Features',
      pricing: 'Pricing',
      blog: 'Blog',
      about: 'About',
      login: 'Login'
    },
    hero: {
      badge: 'Your Future Smart Partner',
      title1: 'Smart Assistant',
      title2: 'Indonesia',
      desc: 'Velicia developed for Nusantara on Gen2 architecture. High efficiency, deep reasoning, and rapid response.',
      startBtn: 'Start Now',
      disclaimer: 'Free forever • No credit card',
      mockupText: 'Hello! How can I assist you today?',
      mockupPrompt: 'Explain your Gen2 capabilities.',
      mockupResponse: 'I am Velicia Gen2, a smart assistant designed with advanced reasoning and efficiency.',
      mockupPowered: 'Velicia Gen2 Engine'
    },
    blog: {
      title: 'Articles & Updates',
      readMore: 'Read',
      viewAll: 'View All',
      articles: [
         {
          id: 4,
          title: "Velicia Officially Switches to Gen2 Library",
          desc: "Performance improvements, reasoning, and speed with the latest architecture.",
          tag: "Tech"
        },
         {
          id: 101,
          title: "Update v1.2: Voice Mode & File Reader",
          desc: "New features for document analysis and natural voice interaction.",
          tag: "Update"
        },
        {
          id: 0,
          title: "Digital Sovereignty Vision",
          desc: "Velicia AI as an independent solution for national tech needs.",
          tag: "Vision"
        }
      ]
    },
    profession: {
      title: 'Professional Solutions',
      items: {
        'Entrepreneur': [
          { title: 'Market Intelligence', desc: 'Competitor & trend analysis.' },
          { title: 'Strategic Partner', desc: 'Strategic business solutions.' },
          { title: 'Document Analysis', desc: 'Contract & report extraction.' },
          { title: 'Email Assistant', desc: 'Contextual response suggestions.' },
        ],
        'Konsultan': [
            { title: 'Instant Presentation', desc: 'Presentation outlines in seconds.' },
            { title: 'Data Analysis', desc: 'Insights from raw data.' },
        ],
        'Peneliti': [
            { title: 'Journal Summary', desc: 'Understand journals instantly.' },
            { title: 'Reference Finder', desc: 'Credible sources & citations.' },
        ],
        'Pengembang': [
            { title: 'Code Generator', desc: 'Boilerplate & complex functions.' },
            { title: 'AI Debugger', desc: 'Find & fix bugs.' },
        ],
        'Pemasaran': [
            { title: 'Copywriter', desc: 'Persuasive ad copy.' },
            { title: 'Campaign Ideas', desc: 'Brainstorm viral ideas.' },
        ]
      }
    },
    team: {
      title: 'Our Gen2 Team',
      subtitle: 'The best young talents building Indonesia\'s AI future.',
    },
    faq: {
      title: 'FAQ',
      items: [
        { q: 'What is Velicia Gen2?', a: 'The latest architecture upgrade that is faster, smarter at reasoning, and efficient.' },
        { q: 'Who created Velicia AI?', a: 'Velicia is developed by a team of AI Engineers, SuperRinz is the Main Developer of Velicia AI.' },
        { q: 'Is it free?', a: 'Yes, free forever for personal use. Pro plans available.' },
        { q: 'How it works?', a: 'Uses a specially optimized independent AI engine with Gen2 NLP.' }
      ]
    },
    footer: {
      text: '© 2026 Velicia AI | SuperRinzDev Inc.'
    }
  }
};

const MockupChat: React.FC<{ t: any }> = ({ t }) => {
  const [step, setStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 5);
    }, 4500);
    return () => clearInterval(timer);
  }, [t]); 

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [step]);

  return (
    <div className="bg-gray-50 rounded-[1.5rem] overflow-hidden aspect-[16/10] border border-gray-100 relative shadow-inner">
      <div className="absolute inset-0 flex">
        <div className="hidden md:block w-40 lg:w-56 bg-white border-r border-gray-100 p-3 space-y-3">
          <div className="flex gap-1.5 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
          </div>
          <div className="space-y-3 opacity-60">
             <div className="h-1.5 w-full bg-gray-100 rounded-full"></div>
             <div className="h-1.5 w-3/4 bg-gray-100 rounded-full"></div>
             <div className="h-1.5 w-5/6 bg-gray-100 rounded-full"></div>
             <div className="h-1.5 w-2/3 bg-gray-100 rounded-full"></div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-50">
             <div className="w-8 h-8 rounded-full bg-purple-100 mb-2"></div>
             <div className="h-1.5 w-1/2 bg-gray-100 rounded-full"></div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 p-4 md:p-6 flex flex-col overflow-y-auto no-scrollbar scroll-smooth"
        >
          <div className="flex gap-3 mb-2 max-w-[90%] animate-in fade-in duration-500">
            <img src="/logo-app.png" alt="Velicia Logo" className="h-8 w-auto object-contain shrink-0" />
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
              <p className="text-xs md:text-sm font-medium text-gray-800">{t.hero.mockupText}</p>
            </div>
          </div>

          {step === 0 && (
             <div className="flex gap-2 ml-11 mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
                <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-600 shadow-sm hover:bg-gray-50 cursor-pointer flex items-center gap-1">
                   <Sparkles size={10} className="text-yellow-500"/> Gen2 Features
                </span>
             </div>
          )}

          {step >= 1 && (
            <div className="flex gap-3 mb-6 flex-row-reverse self-end max-w-fit animate-in slide-in-from-bottom-4 duration-500">
              <div className="w-8 h-8 rounded-full bg-black shrink-0 flex items-center justify-center text-white">
                <Brain size={14} />
              </div>
              <div className="bg-black text-white p-3 rounded-2xl rounded-tr-none shadow-md">
                <p className="text-xs md:text-sm font-medium">{t.hero.mockupPrompt}</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex gap-3 mb-6 animate-in fade-in duration-300">
              <img src="/logo-app.png" alt="Velicia Logo" className="h-8 w-auto object-contain shrink-0 animate-pulse" />
              <div className="flex gap-1.5 mt-3">
                <div className="w-1.5 h-1.5 bg-[#7928CA] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-1.5 bg-[#FF0080] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-[#7928CA] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}

          {step >= 3 && (
            <div className="flex gap-3 mb-6 max-w-[95%] animate-in slide-in-from-bottom-4 duration-700">
              <img src="/logo-app.png" alt="Velicia Logo" className="h-8 w-auto object-contain shrink-0" />
              <div className="flex flex-col gap-2">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                    <p className="text-xs md:text-sm font-medium text-gray-800 leading-relaxed">
                      {t.hero.mockupResponse}
                    </p>
                  </div>
              </div>
            </div>
          )}
          <div className="h-4 w-full shrink-0"></div>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { language, setLanguage, userProfile, toggleModal } = useAppContext();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProfession, setActiveProfession] = useState('Entrepreneur');
  const [scrolled, setScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);
  const [showAllTeam, setShowAllTeam] = useState(false);

  const t = TRANSLATIONS[language]; 

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  const onEnterApp = () => navigate('/app');
  const onReadArticle = (id: number) => navigate(`/article/${id}`);
  const onOpenBlog = () => navigate('/blog');
  const onOpenAbout = () => navigate('/about');
  const onLogin = () => toggleModal('login');

  const blogImages = [
    "/thumbnail-gen2.png",
    "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=2000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop"
  ];

  const blogDates = ["12 Feb", "10 Feb", "12 Okt"];

  const professions = [
    { id: 'Entrepreneur', label: language === 'id' ? 'Bisnis' : 'Business', icon: <Briefcase size={14}/> },
    { id: 'Konsultan', label: language === 'id' ? 'Konsultan' : 'Consultant', icon: <Monitor size={14}/> },
    { id: 'Peneliti', label: language === 'id' ? 'Riset' : 'Research', icon: <Search size={14}/> },
    { id: 'Pengembang', label: language === 'id' ? 'Dev' : 'Dev', icon: <Brain size={14}/> },
    { id: 'Pemasaran', label: language === 'id' ? 'Marketing' : 'Marketing', icon: <Sparkles size={14}/> },
  ];

  const professionIcons: Record<string, React.ElementType[]> = {
    'Entrepreneur': [Layout, Brain, FileText, Mail],
    'Konsultan': [Layout, Brain],
    'Peneliti': [FileText, Search],
    'Pengembang': [Monitor, Zap],
    'Pemasaran': [PenTool, Sparkles]
  };

  const allTeamMembers = [
    { name: 'M. Fariz Alfauzi', role: 'CEO & Lead Engineer', color: 'from-[#7928CA] to-[#FF0080]' },
    { name: 'Sarah A.', role: 'AI Research Lead', color: 'from-[#FF0080] to-[#FF4D4D]' },
    { name: 'Andi W.', role: 'Head of Operations', color: 'from-[#0070F3] to-[#00DFD8]' },
    { name: 'Jessica T.', role: 'Product Manager', color: 'from-[#F59E0B] to-[#D97706]' },
    { name: 'Rian K.', role: 'Cloud Architect', color: 'from-[#10B981] to-[#059669]' },
    { name: 'Kevin S.', role: 'Frontend Wizard', color: 'from-[#3B82F6] to-[#8B5CF6]' },
    { name: 'Dinda R.', role: 'UI/UX Aesthetics', color: 'from-[#EC4899] to-[#F43F5E]' },
    { name: 'Fikri Z.', role: 'Backend Ninja', color: 'from-[#6366F1] to-[#4F46E5]' },
    { name: 'Bella C.', role: 'Social Media Lead', color: 'from-[#F472B6] to-[#DB2777]' },
    { name: 'Reza P.', role: 'Data Scientist', color: 'from-[#14B8A6] to-[#0D9488]' },
    { name: 'Vanya L.', role: 'Community Mgr', color: 'from-[#F59E0B] to-[#D97706]' },
    { name: 'Jojo K.', role: 'DevOps & Sec', color: 'from-[#64748B] to-[#475569]' },
    { name: 'Tasya M.', role: 'Creative Content', color: 'from-[#FB7185] to-[#E11D48]' },
  ];

  const visibleTeam = showAllTeam ? allTeamMembers : allTeamMembers.slice(0, 5);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-pink-100 selection:text-pink-900 overflow-x-hidden">
      
      {/* --- MOBILE MENU OVERLAY --- */}
      <div className={`fixed inset-0 bg-white z-[60] flex flex-col transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
             <div className="flex items-center gap-2">
                 <img src="/logo-app.png" alt="Velicia Logo" className="h-8 w-auto object-contain" />
                 <span className="font-bold text-xl tracking-tight text-gray-900">Velicia</span>
             </div>
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                 <X size={20} />
             </button>
          </div>
          <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
             <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-gray-900">{t.nav.features}</a>
             <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-xl font-bold text-gray-900">{t.nav.pricing}</a>
             <button onClick={() => { setMobileMenuOpen(false); onOpenBlog(); }} className="text-xl font-bold text-gray-900 text-left">{t.nav.blog}</button>
             <button onClick={() => { setMobileMenuOpen(false); onOpenAbout(); }} className="text-xl font-bold text-gray-900 text-left">{t.nav.about}</button>
             
             {!userProfile?.isLoggedIn ? (
                 <button 
                    onClick={() => { setMobileMenuOpen(false); onLogin?.(); }}
                    className="flex items-center gap-2 text-xl font-bold text-[#7928CA]"
                 >
                    <LogIn size={20} /> {t.nav.login}
                 </button>
             ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center text-white font-bold shadow-md">
                        {userProfile.photoURL ? (
                            <img src={userProfile.photoURL} alt={userProfile.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            userProfile.name.charAt(0)
                        )}
                    </div>
                    <span className="font-bold text-gray-900">{userProfile.name}</span>
                </div>
             )}

             <div className="mt-6 pt-6 border-t border-gray-100">
                 <button 
                    onClick={toggleLanguage}
                    className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-xl border border-gray-100"
                 >
                    <div className="flex items-center gap-3">
                        <Globe size={18} className="text-[#7928CA]" />
                        <span className="font-bold text-sm">{t.nav.langLabel === 'ID' ? 'Bahasa Indonesia' : 'English'}</span>
                    </div>
                </button>
             </div>
          </div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <img src="/logo-app.png" alt="Velicia Logo" className="h-10 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-500" />
            <span className="font-bold text-xl tracking-tight text-gray-900">Velicia</span>
          </div>

          <div className="hidden md:flex items-center gap-4">
             <button className="text-sm font-semibold text-gray-600 hover:text-[#FF0080] transition-colors">{t.nav.features}</button>
             <button className="text-sm font-semibold text-gray-600 hover:text-[#FF0080] transition-colors">{t.nav.pricing}</button>
             <button onClick={onOpenBlog} className="text-sm font-semibold text-gray-600 hover:text-[#FF0080] transition-colors">{t.nav.blog}</button>
             <button onClick={onOpenAbout} className="text-sm font-semibold text-gray-600 hover:text-[#FF0080] transition-colors">{t.nav.about}</button>
             
             <div className="w-px h-4 bg-gray-200 mx-2"></div>
             <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-white rounded-full border border-gray-200 text-xs font-bold text-gray-700 cursor-pointer transition-all active:scale-95"
             >
                <span>{t.nav.langLabel}</span>
             </button>
             
             {!userProfile?.isLoggedIn ? (
                 <button 
                    onClick={onLogin}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-all"
                 >
                    <LogIn size={14} /> {t.nav.login}
                 </button>
             ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-white cursor-pointer" onClick={onEnterApp}>
                    {userProfile.photoURL ? (
                        <img src={userProfile.photoURL} alt={userProfile.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        userProfile.name.charAt(0)
                    )}
                </div>
             )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            {!userProfile?.isLoggedIn && (
                <button onClick={onLogin} className="text-[#7928CA] font-bold text-sm flex items-center gap-1">
                    <LogIn size={16} /> {t.nav.login}
                </button>
            )}

            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-16 px-6 bg-white overflow-hidden">
        <div className="hero-glow"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="text-[11px] md:text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase tracking-[0.2em]">
                 {t.hero.badge}
              </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-1000 mb-6 leading-[1.1]">
             {t.hero.title1}
             <div className="relative inline-block ml-3">
                <span className="text-vivid-gradient">
                   {t.hero.title2}
                </span>
             </div>
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
             {t.hero.desc}
          </p>

          <div className="flex flex-col items-center gap-8 mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
             <div className="flex flex-wrap justify-center gap-4">
               <button type="button" className="uiverse-button !min-w-[200px] !py-3 !px-8" onClick={onEnterApp}>
                <span className="fold"></span>
                <div className="flex items-center justify-center gap-2 w-full">
                  <span className="text-white font-bold text-base">{t.hero.startBtn}</span>
                </div>
               </button>
             </div>
             <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{t.hero.disclaimer}</p>
          </div>

          <div className="relative max-w-4xl mx-auto group perspective-1000 mb-8">
             <div className="absolute -inset-2 bg-gradient-to-r from-[#7928CA] to-[#FF0080] rounded-[2rem] opacity-30 blur-2xl group-hover:opacity-40 transition-all duration-700"></div>
             <div className="relative bg-white rounded-[1.5rem] p-2 md:p-3 shadow-xl border border-gray-100 transform transition-transform duration-1000 hover:rotate-x-1">
                <MockupChat t={t} />
             </div>
          </div>
        </div>
      </section>

      {/* --- BLOG SECTION --- */}
      <section id="blog" className="py-20 bg-[#FAFAFA] relative overflow-hidden">
           <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{t.blog.title}</h2>
                <button onClick={onOpenBlog} className="hidden md:flex items-center gap-2 text-[#7928CA] font-bold text-sm hover:gap-3 transition-all">
                    {t.blog.viewAll} <ArrowRight size={16} />
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {t.blog.articles.map((article, i) => (
                    <div 
                        key={i} 
                        className={`bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer animate-in fade-in slide-in-from-bottom-10`}
                        style={{ animationFillMode: 'both', animationDelay: `${i * 150}ms`, animationDuration: '800ms' }}
                        onClick={() => onReadArticle(article.id)}
                    >
                         <div className="h-48 w-full overflow-hidden relative">
                             <img src={blogImages[i]} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                             <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide text-[#7928CA] shadow-sm">{article.tag}</div>
                        </div>
                        <div className="p-6">
                             <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold mb-3 uppercase tracking-wider"><Calendar size={12} />{blogDates[i]}</div>
                             <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-[#FF0080] transition-colors">{article.title}</h3>
                             <div className="flex items-center gap-2 text-[#7928CA] font-bold text-xs group-hover:gap-3 transition-all">{t.blog.readMore} <ArrowRight size={14} /></div>
                        </div>
                    </div>
                ))}
            </div>
            
             <button onClick={onOpenBlog} className="md:hidden w-full mt-8 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-900 hover:bg-gray-50 flex items-center justify-center gap-2">
                    {t.blog.viewAll} <ArrowRight size={16} />
             </button>
            </div>
      </section>

      {/* --- PROFESSIONAL SECTION --- */}
      <section id="features" className="py-20 bg-white">
         <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12 tracking-tight">{t.profession.title}</h2>
            <div className="flex overflow-x-auto pb-4 md:pb-0 md:flex-wrap justify-start md:justify-center gap-3 mb-12 no-scrollbar">
                {professions.map(p => (
                    <button 
                        key={p.id}
                        onClick={() => setActiveProfession(p.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all border whitespace-nowrap ${activeProfession === p.id ? 'bg-black text-white border-black shadow-lg scale-105' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}
                    >
                        {p.icon}
                        {p.label}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(t.profession.items[activeProfession as keyof typeof t.profession.items] || []).map((item, i) => {
                    const Icons = professionIcons[activeProfession] || [Layout];
                    const Icon = Icons[i % Icons.length];
                    return (
                      <div key={i} className="flex gap-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-md transition-all group items-start">
                          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100 group-hover:bg-[#7928CA] group-hover:text-white transition-all">
                              <Icon size={20} />
                          </div>
                          <div className="flex flex-col">
                              <h4 className="text-base font-bold text-gray-900 mb-2">{item.title}</h4>
                              <p className="text-gray-500 leading-snug text-sm font-medium">{item.desc}</p>
                          </div>
                      </div>
                    );
                })}
            </div>
         </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section id="team" className="py-20 bg-[#FAFAFA] border-y border-gray-100 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
           <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">{t.team.title}</h2>
           <p className="text-gray-500 max-w-2xl mx-auto mb-16 font-medium text-lg">{t.team.subtitle}</p>
           
           <div className="flex flex-wrap justify-center gap-8 md:gap-10 animate-in fade-in zoom-in-95 duration-700">
              {visibleTeam.map((member, i) => (
                 <div key={i} className="group relative w-32 md:w-40 flex flex-col items-center">
                    <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${member.color} p-[3px] mb-4 shadow-xl shadow-gray-200 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                       <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden relative">
                           <span className={`text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br ${member.color}`}>
                             {member.name.charAt(0)}
                           </span>
                       </div>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight mb-1">{member.name}</h3>
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{member.role}</p>
                 </div>
              ))}
           </div>
           
           {!showAllTeam && (
               <button 
                 onClick={() => setShowAllTeam(true)}
                 className="mt-16 px-8 py-3 bg-white border border-gray-200 rounded-full font-bold text-sm hover:bg-black hover:text-white hover:border-black transition-all shadow-sm active:scale-95"
               >
                 Lihat Semua Anggota
               </button>
           )}
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12 tracking-tight">{t.faq.title}</h2>
            <div className="space-y-4">
                {t.faq.items.map((item, i) => (
                    <div key={i} className="border border-gray-100 rounded-2xl bg-gray-50 overflow-hidden transition-all hover:border-gray-200">
                        <button 
                            onClick={() => toggleFaq(i)}
                            className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                            <span className="text-sm md:text-base leading-snug">{item.q}</span>
                            {openFaqIndex === i ? <ChevronUp size={20} className="text-[#7928CA]" /> : <ChevronDown size={20} className="text-gray-400" />}
                        </button>
                        <div className={`px-5 text-sm md:text-base text-gray-600 leading-relaxed overflow-hidden transition-all duration-300 ${openFaqIndex === i ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                            {item.a}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-gray-100 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <img src="/logo-app.png" alt="Velicia Logo" className="h-12 w-auto object-contain opacity-80" />
                <span className="font-bold text-xl tracking-tight text-gray-400">Velicia</span>
              </div>
              
              <div className="flex justify-center gap-6 mb-8">
                  <a href="https://www.linkedin.com/in/m-fariz-alfauzi-19b2833b1" target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full text-gray-400 hover:text-[#0077b5] hover:shadow-md transition-all">
                      <Linkedin size={20} />
                  </a>
                  <a href="https://www.instagram.com/account.hezell" target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full text-gray-400 hover:text-[#E4405F] hover:shadow-md transition-all">
                      <Instagram size={20} />
                  </a>
              </div>

              <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">
                {t.footer.text}
              </p>
          </div>
      </footer>
    </div>
  );
}
