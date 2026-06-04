import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, MapPin, Linkedin, Instagram, ArrowRight } from 'lucide-react';
import { useAppContext } from './AppContext';

const TRANSLATIONS = {
  id: {
    title: "Tentang Kreator / About Me",
    name: "M. Fariz Alfauzi",
    alias: "Hezell",
    role: "CEO & Lead Engineer Velicia AI",
    devLabel: "Velicia AI Developer",
    bio1: "M. Fariz Alfauzi, yang akrab dikenal sebagai Hezell, adalah pengembang utama di balik myvelicia ai. Sebagai CEO & Lead Engineer, ia berdedikasi membangun kedaulatan AI Indonesia melalui teknologi Gen2 yang mandiri dan inovatif.",
    bio2: "Dengan fokus pada efisiensi pemrosesan dan antarmuka yang intuitif, Hezell merancang Velicia untuk menjadi asisten cerdas yang tidak hanya canggih secara teknis, tetapi juga mudah diakses oleh seluruh lapisan masyarakat Nusantara.",
    school: "SMK NURUL ISLAM AFFANDIYAH",
    location: "Cianjur, Jawa Barat",
    techStack: "Keahlian Utama",
    connect: "Mari Terhubung",
    back: "Kembali"
  },
  en: {
    title: "About the Creator / About Me",
    name: "M. Fariz Alfauzi",
    alias: "Hezell",
    role: "CEO & Lead Engineer of Velicia AI",
    devLabel: "Velicia AI Developer",
    bio1: "M. Fariz Alfauzi, also known as Hezell, is the lead visionary behind myvelicia ai. As CEO & Lead Engineer, he is dedicated to establishing Indonesia's AI sovereignty through independent and innovative Gen2 technology.",
    bio2: "With a strong focus on processing efficiency and intuitive interfaces, Hezell designed Velicia to be a smart assistant that is not only technically advanced but also accessible to all levels of Indonesian society.",
    school: "SMK NURUL ISLAM AFFANDIYAH",
    location: "Cianjur, West Java",
    techStack: "Core Expertise",
    connect: "Let's Connect",
    back: "Back"
  }
};

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useAppContext();
  const t = TRANSLATIONS[language];

  const onBack = () => navigate(-1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900 pb-24 selection:bg-purple-100 selection:text-purple-900">
      {/* Navbar Minimalis */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-gray-200/50 h-16 flex items-center px-4 md:px-6 justify-between transition-all">
         <button 
           onClick={onBack}
           className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors py-2 pr-4 group"
         >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm">{t.back}</span>
         </button>
         <div className="flex items-center gap-2">
            <img src="/logo-app.png" alt="Logo" className="h-7 w-auto object-contain grayscale opacity-60" />
            <span className="font-bold text-base tracking-tight text-gray-400">Profile</span>
         </div>
         <div className="w-10"></div> {/* Spacer for centering */}
      </nav>

      <main className="pt-32 max-w-3xl mx-auto px-6">
        
        {/* Header Profile Area */}
        <header className="mb-14 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 border-b border-gray-200 pb-10">
                
                {/* Minimalist Avatar */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center shrink-0 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-700 to-black select-none">
                        M
                    </span>
                </div>

                <div className="flex-1">
                    <div className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-md text-[10px] font-bold uppercase tracking-widest mb-4 border border-purple-100">
                        {t.devLabel}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
                        {t.name} <span className="text-gray-400 font-medium text-3xl md:text-4xl">({t.alias})</span>
                    </h1>
                    <p className="text-lg md:text-xl font-medium text-gray-500">
                        {t.role}
                    </p>
                </div>
            </div>
        </header>

        {/* Reading Content Area */}
        <article className="prose prose-lg prose-slate max-w-none prose-p:leading-loose prose-p:text-gray-600 prose-p:font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            
            {/* Paragraph with Drop Cap */}
            <p className="relative">
                <span className="float-left text-6xl md:text-7xl font-black text-gray-900 leading-none pr-3 pt-2 pb-1 text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-600">
                    {t.bio1.charAt(0)}
                </span>
                {t.bio1.slice(1)}
            </p>

            <p>
                {t.bio2}
            </p>

            {/* Background Information Box (Integrated smoothly into the article) */}
            <div className="not-prose mt-12 mb-12 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-8 -mt-8"></div>
                
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 relative z-10">Latar Belakang Akademis & Lokasi</h3>
                
                <ul className="space-y-4 relative z-10">
                    <li className="flex items-center gap-4 text-gray-600">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                            <GraduationCap size={20}/>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Pendidikan</div>
                            <div className="font-semibold text-gray-900">{t.school}</div>
                        </div>
                    </li>
                    <li className="flex items-center gap-4 text-gray-600">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                            <MapPin size={20}/>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Basis Operasi</div>
                            <div className="font-semibold text-gray-900">{t.location}</div>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Social Media & Contact Section */}
            <div className="not-prose pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-black text-gray-900 mb-6">{t.connect}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* LinkedIn Card */}
                    <a 
                        href="https://www.linkedin.com/in/m-fariz-alfauzi-19b2833b1" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-4 p-5 bg-white border border-gray-200 hover:border-blue-300 rounded-2xl transition-all hover:shadow-md group no-underline"
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <Linkedin size={24} className="text-[#0077b5] group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1">
                            <div className="text-base font-bold text-gray-900 leading-tight">LinkedIn</div>
                            <div className="text-xs text-gray-500 font-medium mt-0.5">Koneksi Profesional</div>
                        </div>
                        <ArrowRight size={18} className="text-gray-300 group-hover:text-[#0077b5] group-hover:translate-x-1 transition-all" />
                    </a>

                    {/* Instagram Card */}
                    <a 
                        href="https://www.instagram.com/account.hezell" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-4 p-5 bg-white border border-gray-200 hover:border-pink-300 rounded-2xl transition-all hover:shadow-md group no-underline"
                    >
                        <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
                            <Instagram size={24} className="text-[#E4405F] group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1">
                            <div className="text-base font-bold text-gray-900 leading-tight">Instagram</div>
                            <div className="text-xs text-gray-500 font-medium mt-0.5">@account.hezell</div>
                        </div>
                        <ArrowRight size={18} className="text-gray-300 group-hover:text-[#E4405F] group-hover:translate-x-1 transition-all" />
                    </a>
                </div>
            </div>

        </article>
      </main>
    </div>
  );
};

export default AboutPage;