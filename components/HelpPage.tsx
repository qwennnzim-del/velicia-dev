
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Zap, FileText, Mic, Search, Shield, ChevronRight, Menu, X } from 'lucide-react';
import { useAppContext } from './AppContext';

const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useAppContext();
  const [activeSection, setActiveSection] = useState('intro');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onBack = () => navigate(-1);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['intro', 'start', 'models', 'files', 'voice', 'privacy'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  const CONTENT = {
    id: {
      title: "Dokumentasi Velicia",
      subtitle: "Panduan lengkap penggunaan asisten AI Gen2.",
      menu: [
        { id: 'intro', label: 'Pengenalan', icon: Book },
        { id: 'start', label: 'Memulai', icon: Zap },
        { id: 'models', label: 'Model AI', icon: BrainIcon },
        { id: 'files', label: 'Analisis File', icon: FileText },
        { id: 'voice', label: 'Mode Suara', icon: Mic },
        { id: 'privacy', label: 'Privasi', icon: Shield },
      ],
      sections: {
        intro: {
          title: "Apa itu Velicia?",
          content: `Velicia adalah asisten AI mandiri yang dibangun di atas arsitektur Gen2 (Generasi Berikutnya). Velicia dirancang untuk memahami konteks budaya Indonesia, melakukan tugas dengan cepat, dan memberikan solusi produktivitas yang nyata.`,
          points: [
            "Arsitektur Gen2 Flash yang sangat cepat.",
            "Dukungan Bahasa Indonesia yang natural.",
            "Terintegrasi dengan Google Search untuk data realtime."
          ]
        },
        start: {
          title: "Cara Memulai",
          content: `Untuk mulai menggunakan Velicia, Anda hanya perlu mengetikkan pertanyaan atau perintah di kolom chat utama.`,
          steps: [
            "Buka Dashboard utama.",
            "Pastikan model Gen2 Flash aktif (default).",
            "Ketik pesan Anda atau unggah file.",
            "Tekan Enter atau tombol Kirim."
          ]
        },
        models: {
          title: "Model Kecerdasan",
          content: `Saat ini Velicia menggunakan satu model utama yang telah dioptimalkan untuk segala kebutuhan:`,
          items: [
            {
              name: "Gen2 Flash",
              desc: "Model super cepat, ringan, dan stabil. Ideal untuk percakapan santai, pertanyaan singkat, terjemahan, coding ringan, serta tugas-tugas administratif yang membutuhkan respon instan. Didukung oleh teknologi Gemini 2.5 Flash."
            }
          ]
        },
        files: {
          title: "Analisis Dokumen & Gambar",
          content: `Velicia memiliki mata digital. Anda dapat mengunggah hingga 5 file sekaligus untuk dianalisis.`,
          types: "Format yang didukung: JPG, PNG, PDF, CSV, Excel, TXT, DOCX.",
          tips: "Tips: Unggah foto soal matematika atau laporan keuangan, lalu minta Velicia menyelesaikannya atau membuat ringkasan."
        },
        voice: {
          title: "Interaksi Suara (TTS)",
          content: `Anda tidak harus selalu membaca. Velicia dapat membacakan jawabannya untuk Anda dengan suara yang natural.`,
          how: "Klik ikon Speaker (Volume) di bawah pesan balasan Velicia untuk mendengarkan. Klik sekali lagi untuk berhenti."
        },
        privacy: {
          title: "Privasi & Keamanan",
          content: `Privasi Anda adalah prioritas kami. Percakapan Anda disimpan secara lokal di browser Anda (Local Storage) dan tidak dikirim ke server pihak ketiga untuk pelatihan model tanpa izin.`,
          note: "Anda dapat menghapus seluruh riwayat percakapan kapan saja melalui menu Pengaturan."
        }
      }
    },
    en: {
      title: "Velicia Documentation",
      subtitle: "Complete guide to using Gen2 AI assistant.",
      menu: [
        { id: 'intro', label: 'Introduction', icon: Book },
        { id: 'start', label: 'Getting Started', icon: Zap },
        { id: 'models', label: 'AI Models', icon: BrainIcon },
        { id: 'files', label: 'File Analysis', icon: FileText },
        { id: 'voice', label: 'Voice Mode', icon: Mic },
        { id: 'privacy', label: 'Privacy', icon: Shield },
      ],
      sections: {
        intro: {
          title: "What is Velicia?",
          content: `Velicia is an independent AI assistant built on Gen2 (Next Generation) architecture. Velicia is designed to understand Indonesian cultural context, perform tasks quickly, and provide tangible productivity solutions.`,
          points: [
            "Super fast Gen2 Flash architecture.",
            "Natural Indonesian Language support.",
            "Integrated with Google Search for real-time data."
          ]
        },
        start: {
          title: "Getting Started",
          content: `To start using Velicia, simply type a question or command in the main chat box.`,
          steps: [
            "Open the main Dashboard.",
            "Ensure Gen2 Flash model is active (default).",
            "Type your message or upload a file.",
            "Press Enter or the Send button."
          ]
        },
        models: {
          title: "Intelligence Model",
          content: `Currently, Velicia uses one primary model optimized for all needs:`,
          items: [
            {
              name: "Gen2 Flash",
              desc: "Super fast, lightweight, and stable model. Ideal for casual chat, short questions, translation, light coding, and administrative tasks requiring instant responses. Powered by Gemini 2.5 Flash technology."
            }
          ]
        },
        files: {
          title: "Document & Image Analysis",
          content: `Velicia has digital eyes. You can upload up to 5 files at once for analysis.`,
          types: "Supported formats: JPG, PNG, PDF, CSV, Excel, TXT, DOCX.",
          tips: "Tip: Upload a photo of a math problem or financial report, then ask Velicia to solve or summarize it."
        },
        voice: {
          title: "Voice Interaction (TTS)",
          content: `You don't always have to read. Velicia can read out her answers to you with a natural voice.`,
          how: "Click the Speaker (Volume) icon below Velicia's response to listen. Click again to stop."
        },
        privacy: {
          title: "Privacy & Security",
          content: `Your privacy is our priority. Your conversations are stored locally in your browser (Local Storage) and are not sent to third-party servers for model training without permission.`,
          note: "You can clear your entire chat history anytime via the Settings menu."
        }
      }
    }
  };

  const t = CONTENT[language];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-pink-100 selection:text-pink-900">
      
      {/* Navbar Fixed */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 h-16 flex items-center px-4 md:px-6 justify-between">
         <div className="flex items-center gap-4">
             <button 
               onClick={onBack}
               className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
             >
                <ArrowLeft size={20} />
             </button>
             <div className="flex items-center gap-2">
                <img src="/logo-app.png" alt="Logo" className="h-8 w-auto object-contain" />
                <span className="font-bold text-lg tracking-tight hidden md:block">Velicia Docs</span>
             </div>
         </div>
         <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
         >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
         </button>
      </nav>

      <div className="flex max-w-7xl mx-auto pt-16">
        
        {/* Sidebar Navigation (Desktop) */}
        <aside className="hidden md:block w-64 fixed top-16 bottom-0 left-[max(0px,calc(50%-40rem))] border-r border-gray-100 overflow-y-auto py-8 pr-6 pl-6 bg-white z-40">
           <div className="mb-6">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Daftar Isi</h5>
              <nav className="space-y-1">
                 {t.menu.map((item) => (
                   <button
                     key={item.id}
                     onClick={() => scrollToSection(item.id)}
                     className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                       activeSection === item.id 
                         ? 'bg-purple-50 text-[#7928CA] font-bold' 
                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                     }`}
                   >
                     <item.icon size={16} className={activeSection === item.id ? 'text-[#7928CA]' : 'text-gray-400'} />
                     {item.label}
                   </button>
                 ))}
              </nav>
           </div>
        </aside>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
           <div className="fixed inset-0 z-40 bg-white pt-20 px-6 md:hidden animate-in fade-in slide-in-from-top-10">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Navigasi</h5>
              <div className="space-y-2">
                 {t.menu.map((item) => (
                   <button
                     key={item.id}
                     onClick={() => scrollToSection(item.id)}
                     className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium rounded-xl bg-gray-50 text-gray-800"
                   >
                     <item.icon size={18} />
                     {item.label}
                   </button>
                 ))}
              </div>
           </div>
        )}

        {/* Main Content */}
        <main className="flex-1 md:pl-72 px-6 py-10 md:py-12 max-w-4xl">
            
            <div className="mb-12 border-b border-gray-100 pb-10">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">{t.title}</h1>
                <p className="text-lg md:text-xl text-gray-500 font-medium">{t.subtitle}</p>
            </div>

            {/* Intro */}
            <section id="intro" className="mb-16 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Book size={24} /></div>
                    <h2 className="text-2xl font-bold text-gray-900">{t.sections.intro.title}</h2>
                </div>
                <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed">
                    <p className="mb-4">{t.sections.intro.content}</p>
                    <ul className="space-y-2">
                        {t.sections.intro.points.map((point, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Getting Started */}
            <section id="start" className="mb-16 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600"><Zap size={24} /></div>
                    <h2 className="text-2xl font-bold text-gray-900">{t.sections.start.title}</h2>
                </div>
                <div className="prose prose-slate max-w-none text-gray-600">
                    <p className="mb-6">{t.sections.start.content}</p>
                    <div className="grid gap-4 md:grid-cols-2">
                        {t.sections.start.steps.map((step, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white font-bold text-gray-900 border border-gray-200 shadow-sm shrink-0">
                                    {i + 1}
                                </span>
                                <span className="text-sm font-medium text-gray-700 mt-1.5">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Models */}
            <section id="models" className="mb-16 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><BrainIcon size={24} /></div>
                    <h2 className="text-2xl font-bold text-gray-900">{t.sections.models.title}</h2>
                </div>
                <p className="text-gray-600 mb-6">{t.sections.models.content}</p>
                <div className="grid gap-6 md:grid-cols-2">
                    {t.sections.models.items.map((model, i) => (
                        <div key={i} className="p-6 rounded-2xl border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all group bg-white">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{model.name}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{model.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Files */}
            <section id="files" className="mb-16 scroll-mt-24">
                 <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText size={24} className="text-green-400" />
                        <h2 className="text-2xl font-bold">{t.sections.files.title}</h2>
                    </div>
                    <p className="mb-6 opacity-90 leading-relaxed">{t.sections.files.content}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {['PDF', 'DOCX', 'EXCEL', 'JPG', 'PNG'].map(fmt => (
                            <span key={fmt} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold tracking-wide border border-white/20">{fmt}</span>
                        ))}
                    </div>
                    <div className="flex gap-3 p-4 bg-white/10 rounded-xl border border-white/10">
                         <Search className="shrink-0 text-yellow-400" size={20} />
                         <p className="text-sm font-medium opacity-90 italic">"{t.sections.files.tips}"</p>
                    </div>
                 </div>
            </section>

            {/* Voice */}
            <section id="voice" className="mb-16 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-pink-50 rounded-lg text-pink-600"><Mic size={24} /></div>
                    <h2 className="text-2xl font-bold text-gray-900">{t.sections.voice.title}</h2>
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1">
                         <p className="text-gray-600 mb-4 leading-relaxed">{t.sections.voice.content}</p>
                         <p className="text-sm font-medium text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            💡 {t.sections.voice.how}
                         </p>
                    </div>
                    <div className="w-full md:w-1/3 flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center animate-pulse">
                            <Mic size={32} className="text-pink-600" />
                        </div>
                    </div>
                </div>
            </section>

             {/* Privacy */}
             <section id="privacy" className="mb-20 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600"><Shield size={24} /></div>
                    <h2 className="text-2xl font-bold text-gray-900">{t.sections.privacy.title}</h2>
                </div>
                <div className="prose prose-slate max-w-none text-gray-600">
                    <p className="mb-4">{t.sections.privacy.content}</p>
                    <div className="flex items-start gap-3 p-4 border-l-4 border-green-500 bg-green-50 rounded-r-xl">
                        <CheckCircleIcon size={20} className="text-green-600 mt-0.5 shrink-0" />
                        <span className="text-sm font-bold text-green-800">{t.sections.privacy.note}</span>
                    </div>
                </div>
            </section>

            <div className="border-t border-gray-100 pt-10 text-center">
                <p className="text-gray-400 text-sm">© 2026 Velicia AI Documentation</p>
            </div>

        </main>
      </div>
    </div>
  );
};

// Simple Icon Wrappers
const BrainIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.97-3.465"/><path d="M19.97 14.535A4 4 0 0 1 18 18"/></svg>
)

const CheckCircleIcon = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
)

export default HelpPage;