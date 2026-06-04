"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import MessageList from '@/components/MessageList';
import InputArea from '@/components/InputArea';
import Dashboard from '@/components/Dashboard';
import Sidebar from '@/components/Sidebar';
import Onboarding, { OnboardingStep } from '@/components/Onboarding';
import { Message, Role, ModelType, DEFAULT_MODELS, ModelOption, Attachment, ChatSession } from '@/types';
import { streamMessageToGemini } from '@/services/geminiService';
import { auth, logout, logAnalyticsEvent } from '@/services/firebase';
import { loadChatsFromFirestore, saveChatToFirestore, deleteChatFromFirestore, loadChatsFromLocal, saveChatToLocal } from '@/services/chatService';
import { useAppContext } from '@/components/AppContext';

const APP_TRANSLATIONS = {
  id: {
    sidebar: {
      nav: 'Navigasi',
      home: 'Utama',
      features: 'Fitur',
      blog: 'Blog & Update',
      history: 'Riwayat Chat',
      emptyHistory: 'Belum ada riwayat percakapan.',
      newChat: 'Chat Baru',
      settings: 'Atur',
      info: 'Panduan', 
      login: 'Masuk',
      logout: 'Keluar Akun',
      welcome: 'Pengguna Velicia'
    },
    dashboard: {
      welcome: 'Selamat datang di Velicia.ai',
      subtitle: 'Asisten cerdas Anda untuk obrolan, kreativitas, dan produktivitas tanpa batas.',
      chatBtn: 'Chat AI'
    },
    input: {
      placeholder: 'Ketik pesan ke Velicia...',
      placeholderFile: 'Ketik pesan...',
      maxFiles: 'Maksimal 5 file sekaligus.'
    },
    messageList: {
      thinking: ["Berfikir...", "Analisis prompt...", "Mengidentifikasi...", "Menyusun jawaban...", "Mencari jawaban akurat...", "Menyampaikan hasil..."],
      searching: ["Menghubungkan ke Google...", "Mencari informasi...", "Menelusuri situs...", "Informasi ditemukan!"],
      youtube: ["Menghubungkan ke YouTube...", "Mencari video relevan...", "Mengambil cuplikan...", "Video ditemukan!"],
      generatingVision: 'Generating Vision...',
      source: 'Sumber Penelusuran',
      listen: 'Dengar',
      stop: 'Stop',
      copy: 'Salin',
      copied: 'Disalin',
      like: 'Suka',
      share: 'Bagikan',
      edit: 'Edit pesan',
      save: 'Simpan',
      cancel: 'Batal',
      thinkingProcess: 'Proses Berpikir',
      analysisLog: 'Log Analisis'
    },
    header: {
        welcome: 'Selamat Datang',
        newChat: 'Chat Baru'
    },
    onboarding: [
        {
            title: "Selamat Datang di Velicia",
            description: "Mari kita jelajahi fitur-fitur utama untuk memaksimalkan pengalaman AI Anda. Hanya butuh 30 detik!",
            targetId: undefined 
        },
        {
            title: "Pilih Kecerdasan",
            description: "Ganti model AI di sini. Pilih Gen2 Deep untuk penalaran mendalam atau Gen2 Flash untuk kecepatan.",
            targetId: "tour-model-selector",
            position: "top"
        },
        {
            title: "Upload File & Gambar",
            description: "Velicia bisa melihat! Unggah gambar atau dokumen untuk dianalisis langsung.",
            targetId: "tour-attachments",
            position: "top"
        },
        {
            title: "Mulai Percakapan",
            description: "Ketik pertanyaan Anda di sini. Velicia siap membantu tugas coding, menulis, hingga analisis data.",
            targetId: "tour-input",
            position: "top"
        }
    ]
  },
  en: {
    sidebar: {
      nav: 'Navigation',
      home: 'Home',
      features: 'Features',
      blog: 'Blog & Updates',
      history: 'Chat History',
      emptyHistory: 'No conversation history.',
      newChat: 'New Chat',
      settings: 'Settings',
      info: 'Guide',
      login: 'Login',
      logout: 'Logout',
      welcome: 'Velicia User'
    },
    dashboard: {
      welcome: 'Welcome to Velicia.ai',
      subtitle: 'Your intelligent assistant for chat, creativity, and boundless productivity.',
      chatBtn: 'AI Chat'
    },
    input: {
      placeholder: 'Type a message to Velicia...',
      placeholderFile: 'Type a message...',
      maxFiles: 'Maximum 5 files at once.'
    },
    messageList: {
      thinking: ["Thinking...", "Analyzing prompt...", "Identifying...", "Composing answer...", "Seeking accurate answer...", "Delivering result..."],
      searching: ["Connecting to Google...", "Searching information...", "Browsing sites...", "Information found!"],
      youtube: ["Connecting to YouTube...", "Searching relevant videos...", "Fetching clips...", "Video found!"],
      generatingVision: 'Generating Vision...',
      source: 'Search Sources',
      listen: 'Listen',
      stop: 'Stop',
      copy: 'Copy',
      copied: 'Copied',
      like: 'Like',
      share: 'Share',
      edit: 'Edit message',
      save: 'Save',
      cancel: 'Cancel',
      thinkingProcess: 'Thinking Process',
      analysisLog: 'Analysis Log'
    },
    header: {
        welcome: 'Welcome',
        newChat: 'New Chat'
    },
    onboarding: [
        {
            title: "Welcome to Velicia",
            description: "Let's explore the key features to maximize your AI experience. It only takes 30 seconds!",
            targetId: undefined
        },
        {
            title: "Choose Intelligence",
            description: "Switch AI models here. Choose Gen2 Deep for deep reasoning or Gen2 Flash for speed.",
            targetId: "tour-model-selector",
            position: "top"
        },
        {
            title: "Upload Files & Images",
            description: "Velicia can see! Upload images or documents for instant analysis.",
            targetId: "tour-attachments",
            position: "top"
        },
        {
            title: "Start Chatting",
            description: "Type your query here. Velicia is ready to help with coding, writing, and data analysis.",
            targetId: "tour-input",
            position: "top"
        }
    ]
  }
};

export default function ChatAppPage() {
    const navigate = useNavigate();
    const { 
        userProfile, language, setLanguage, 
        isSidebarOpen, setIsSidebarOpen, 
        toggleModal 
    } = useAppContext();

    // --- CHAT STATE ---
    const [messages, setMessages] = useState<Message[]>([]);
    const [history, setHistory] = useState<ChatSession[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const activeChatIdRef = useRef<string | null>(null);
    
    useEffect(() => {
        activeChatIdRef.current = activeChatId;
    }, [activeChatId]);

    const [isAILoading, setIsAILoading] = useState(false);
    const [loadingState, setLoadingState] = useState<'idle' | 'thinking' | 'searching' | 'youtube_search'>('idle');
    const [model, setModel] = useState<string>(ModelType.GEN2_V2_5);
    
    // --- ONBOARDING STATE ---
    const [showOnboarding, setShowOnboarding] = useState(false);

    // --- FIREBASE AUTH LISTENER & DATA SYNC ---
    useEffect(() => {
        const loadData = async () => {
            if (userProfile.isLoggedIn && userProfile.uid) {
                const cloudChats = await loadChatsFromFirestore(userProfile.uid);
                setHistory(cloudChats);
                
                const savedActiveId = localStorage.getItem('velicia_active_chat_id');
                if (savedActiveId && cloudChats.find(c => c.id === savedActiveId)) {
                    setActiveChatId(savedActiveId);
                } else {
                    setActiveChatId(null);
                    setMessages([]);
                }
            } else {
                const localChats = loadChatsFromLocal();
                setHistory(localChats);

                const savedActiveId = localStorage.getItem('velicia_active_chat_id');
                if (savedActiveId && localChats.find(c => c.id === savedActiveId)) {
                    setActiveChatId(savedActiveId);
                }
            }
        };
        loadData();
    }, [userProfile.isLoggedIn, userProfile.uid]);

    useEffect(() => {
        if (!userProfile.isLoggedIn) {
            saveChatToLocal(history);
        }
    }, [history, userProfile.isLoggedIn]);

    useEffect(() => {
        if (activeChatId) {
            localStorage.setItem('velicia_active_chat_id', activeChatId);
        } else {
            localStorage.removeItem('velicia_active_chat_id');
        }
    }, [activeChatId]);

    // Sync Messages state when History/ActiveChat changes
    useEffect(() => {
        if (activeChatId && history.length > 0) {
            const session = history.find(s => s.id === activeChatId);
            if (session) {
                setMessages(session.messages);
            } else {
               setActiveChatId(null);
               setMessages([]);
            }
        }
    }, [history, activeChatId]);

    // --- NAVIGATION HANDLERS ---
    const checkOnboarding = () => {
        const hasOnboarded = localStorage.getItem('velicia_has_onboarded');
        if (!hasOnboarded) {
            setTimeout(() => setShowOnboarding(true), 1000);
        }
    };
    
    useEffect(() => {
        checkOnboarding();
    }, []);

    const handleNavigateFromSidebar = (sectionId: string) => {
        setIsSidebarOpen(false);
        
        if (sectionId === 'blog') {
            navigate('/blog');
            return;
        }

        navigate('/?scrollTo=' + sectionId);
    };

    const finishOnboarding = () => {
        setShowOnboarding(false);
        localStorage.setItem('velicia_has_onboarded', 'true');
        logAnalyticsEvent('tutorial_complete');
    };

    // --- CHAT LOGIC ---

    const createNewSession = (firstMessage: Message) => {
        const newSession: ChatSession = {
            id: Date.now().toString(),
            title: firstMessage.text.slice(0, 30) + (firstMessage.text.length > 30 ? '...' : ''),
            messages: [firstMessage],
            timestamp: Date.now()
        };
        setHistory(prev => [...prev, newSession]);
        setActiveChatId(newSession.id);
        
        if (userProfile.isLoggedIn && userProfile.uid) {
            saveChatToFirestore(userProfile.uid, newSession);
        }

        return newSession;
    };

    const updateActiveSession = (sessionId: string, newMessages: Message[]) => {
        setHistory(prev => {
            const updated = prev.map(session => 
               session.id === sessionId ? { ...session, messages: newMessages } : session
            );
            
            const sessionToSave = updated.find(s => s.id === sessionId);
            if (sessionToSave && userProfile.isLoggedIn && userProfile.uid) {
                saveChatToFirestore(userProfile.uid, sessionToSave);
            }

            return updated;
        });
    };

    const handleSelectChat = (id: string) => {
        const session = history.find(s => s.id === id);
        if (session) {
            setActiveChatId(id);
            setMessages(session.messages);
        }
    };

    const handleDeleteChat = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setHistory(prev => prev.filter(s => s.id !== id));
        if (activeChatId === id) {
            setActiveChatId(null);
            setMessages([]);
        }
        
        if (userProfile.isLoggedIn && userProfile.uid) {
            deleteChatFromFirestore(userProfile.uid, id);
        }
    };

    const handleNewChat = () => {
      setMessages([]);
      setActiveChatId(null);
      setIsAILoading(false);
      setLoadingState('idle');
    };

    const handleSend = async (text: string, selectedModel: string, attachments?: Attachment[]) => {
      logAnalyticsEvent('send_message', { 
          model_id: selectedModel,
          has_attachments: attachments && attachments.length > 0 
      });

      const newUserMessage: Message = {
        id: Date.now().toString(),
        role: Role.USER,
        text: text,
        timestamp: Date.now(),
        attachments: attachments 
      };

      let currentMessages = [...messages, newUserMessage];
      setMessages(currentMessages);
      
      let targetSessionId = activeChatId;
      
      if (!targetSessionId) {
          const newSession = createNewSession(newUserMessage);
          targetSessionId = newSession.id;
      } else {
          updateActiveSession(targetSessionId, currentMessages);
      }

      await processAIResponse(text, selectedModel, currentMessages, attachments, targetSessionId);
    };

    const processAIResponse = async (text: string, selectedModel: string, historyMessages: Message[], attachments: Attachment[] | undefined, sessionId: string) => {
      setIsAILoading(true);
      setLoadingState('thinking'); 

      const lowerText = text.toLowerCase();
      const hasAttachments = attachments && attachments.length > 0;
      
      const youtubeKeywords = ['youtube', 'video', 'nonton', 'watch', 'clip', 'cuplikan', 'trailer', 'film'];
      const isYoutubeIntent = youtubeKeywords.some(keyword => lowerText.includes(keyword)) && !hasAttachments;
      
      const searchKeywords = [
          'siapa', 'kapan', 'dimana', 'berapa', 'terbaru', 'berita', 'hari ini', 'sekarang', 
          'news', 'latest', 'price', 'who', 'when', 'where', 'search', 'cari', 'info', 
          'live', 'realtime', 'gaza', 'israel', 'gempa', 'cuaca', 'skor', 'hasil', 'profil',
          'biografi', 'saham', 'kurs', 'rupiah', 'dollar', 'jadwal', 'klasemen', 'pemilu',
          'presiden', 'menteri', 'kebijakan', 'uu', 'hukum', 'kasus', 'viral', 'trending'
      ];
      const isGeneralSearch = searchKeywords.some(keyword => lowerText.includes(keyword)) && !hasAttachments;

      let searchToggleInterval: ReturnType<typeof setInterval> | undefined;
      if (isYoutubeIntent || isGeneralSearch) {
          const searchType = isYoutubeIntent ? 'youtube_search' : 'searching';
          setLoadingState(searchType);
          searchToggleInterval = setInterval(() => {
              setLoadingState(currentState => 
                  (currentState === 'searching' || currentState === 'youtube_search') ? 'thinking' : searchType
              );
          }, 2500); 
      }

      const aiMessageId = (Date.now() + 1).toString();
      const placeholderMessage: Message = {
          id: aiMessageId,
          role: Role.MODEL,
          text: '', 
          timestamp: Date.now(),
      };
      
      const updateConversationState = (updatedMsg: Message) => {
          setHistory(prevHistory => {
              return prevHistory.map(session => {
                  if (session.id === sessionId) {
                      const msgExists = session.messages.some(m => m.id === updatedMsg.id);
                      let newMessages;
                      if (msgExists) {
                          newMessages = session.messages.map(m => m.id === updatedMsg.id ? updatedMsg : m);
                      } else {
                          newMessages = [...session.messages, updatedMsg];
                      }
                      
                      if (activeChatIdRef.current === sessionId) {
                          setMessages(newMessages);
                      }
                      
                      return { ...session, messages: newMessages };
                  }
                  return session;
              });
          });
      };

      updateConversationState(placeholderMessage);

      try {
        const stream = streamMessageToGemini(text, selectedModel, historyMessages, attachments);
        
        let accumulatedText = "";
        let finalMetadata = undefined;
        
        for await (const chunk of stream) {
            accumulatedText += chunk.text;
            if (chunk.groundingMetadata) finalMetadata = chunk.groundingMetadata;
            
            const updatedAiMessage: Message = {
                ...placeholderMessage,
                text: accumulatedText,
                groundingMetadata: finalMetadata || placeholderMessage.groundingMetadata
            };
            
            updateConversationState(updatedAiMessage);
        }
        
        setHistory(prev => {
            const finalSession = prev.find(s => s.id === sessionId);
            if (finalSession && userProfile.isLoggedIn && userProfile.uid) {
                saveChatToFirestore(userProfile.uid, finalSession);
            }
            return prev;
        });

      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: Message = {
          id: aiMessageId,
          role: Role.MODEL,
          text: error instanceof Error ? `⚠️ ${error.message}` : "Maaf, terjadi kesalahan.",
          timestamp: Date.now(),
        };
        updateConversationState(errorMessage);
        logAnalyticsEvent('error', { type: 'ai_generation', message: error instanceof Error ? error.message : 'Unknown' });

      } finally {
        if (searchToggleInterval) clearInterval(searchToggleInterval);
        setIsAILoading(false);
        setLoadingState('idle');
      }
    };

    const handleEditMessage = async (messageId: string, newText: string) => {
      const messageIndex = messages.findIndex(m => m.id === messageId);
      if (messageIndex === -1) return;
      const pastMessages = messages.slice(0, messageIndex);
      const oldMessage = messages[messageIndex];
      const updatedUserMessage: Message = { ...oldMessage, text: newText, timestamp: Date.now() };
      const newHistory = [...pastMessages, updatedUserMessage];
      
      setMessages(newHistory);
      
      if (activeChatId) {
          updateActiveSession(activeChatId, newHistory);
          await processAIResponse(newText, model, newHistory, updatedUserMessage.attachments, activeChatId);
      }
    };

    const handleModelSelectFromDashboard = (type: 'text' | 'image') => {
      setModel(ModelType.GEN2_V2_5);
      logAnalyticsEvent('dashboard_action', { action: type });
    };

    const handleAuthAction = async () => {
        if (userProfile.isLoggedIn) {
            if (window.confirm("Apakah Anda yakin ingin keluar?")) {
               await logout();
               logAnalyticsEvent('logout');
            }
        } else {
            toggleModal('login');
        }
    };

    return (
        <div className="fixed inset-0 w-full h-[100dvh] bg-[#FAFAFA] flex flex-col overflow-hidden text-gray-900 font-sans">
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                onNewChat={handleNewChat}
                onNavigate={handleNavigateFromSidebar}
                
                history={history}
                activeChatId={activeChatId}
                onSelectChat={handleSelectChat}
                onDeleteChat={handleDeleteChat}
                
                userProfile={userProfile}
                
                onOpenSettings={() => toggleModal('settings')}
                onOpenProfile={() => toggleModal('profile')}
                onOpenHelp={() => navigate('/help')} 
                onLogin={handleAuthAction} 
                translations={APP_TRANSLATIONS[language]}
            />
            
            <Header 
                onNewChat={handleNewChat} 
                onMenuClick={() => setIsSidebarOpen(true)} 
                user={userProfile.isLoggedIn ? { name: userProfile.name, initial: userProfile.name.charAt(0), photoURL: userProfile.photoURL } : null} 
                translations={APP_TRANSLATIONS[language]}
            />
            
            <main className="flex-1 w-full max-w-5xl mx-auto pt-20 overflow-y-auto no-scrollbar relative flex flex-col scroll-smooth">
                <div className="flex-1 px-4 md:px-6 py-4">
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <Dashboard 
                                onModelSelect={handleModelSelectFromDashboard} 
                                onPromptSelect={(text) => handleSend(text, model, undefined)}
                                translations={APP_TRANSLATIONS[language]} 
                            />
                        </div>
                    ) : (
                        <MessageList 
                            messages={messages} 
                            isLoading={isAILoading} 
                            loadingState={loadingState} 
                            currentModel={model} 
                            onEditMessage={handleEditMessage}
                            translations={APP_TRANSLATIONS[language]}
                        />
                    )}
                </div>
            </main>

            <InputArea 
                onSend={handleSend} 
                isLoading={isAILoading} 
                selectedModel={model}
                availableModels={DEFAULT_MODELS}
                onModelChange={setModel}
                translations={APP_TRANSLATIONS[language]}
            />

            {showOnboarding && (
                <Onboarding 
                    steps={APP_TRANSLATIONS[language].onboarding as OnboardingStep[]} 
                    isOpen={showOnboarding}
                    onComplete={finishOnboarding} 
                    onSkip={finishOnboarding} 
                />
            )}
        </div>
    );
}
