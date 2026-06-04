
import React, { useRef, useEffect, useState } from 'react';
import { Message, Role } from '../types';
import ReactMarkdown from 'react-markdown';
import { generateSpeechFromGemini } from '../services/geminiService';
import { Copy, ThumbsUp, Share2, Edit2, Check, ExternalLink, Globe, Play, Youtube, FileText, Brain, ChevronDown, Cpu, Volume2, StopCircle, Loader2, Download, Image as ImageIcon, Video, FileSpreadsheet, FileChartColumn } from 'lucide-react';
import remarkGfm from 'remark-gfm'; 

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  loadingState?: 'idle' | 'thinking' | 'searching' | 'youtube_search';
  currentModel: string;
  onEditMessage: (messageId: string, newText: string) => void;
  translations: any;
}

// --- Helper: Extract YouTube ID ---
const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// --- Helper: Clean Markdown for Speech ---
const cleanMarkdownForSpeech = (text: string) => {
  if (!text) return "";
  
  // 1. Remove XML Tags (Thinking)
  let clean = text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
  clean = clean.replace(/<answer>/gi, '').replace(/<\/answer>/gi, '');
  
  // Legacy cleanup
  clean = clean.replace(/PART 1: THE THINKING SPACE[\s\S]*?PART 2: THE FINAL EXECUTION/i, '');
  
  // 2. Remove Code Blocks
  clean = clean.replace(/```[\s\S]*?```/g, 'Code block ignored. ');
  
  // 3. Remove URLs
  clean = clean.replace(/https?:\/\/[^\s]+/g, 'link. ');

  // 4. Remove Markdown formatting
  clean = clean.replace(/(\*\*|__)(.*?)\1/g, '$2'); // Bold
  clean = clean.replace(/(\*|_)(.*?)\1/g, '$2');   // Italic
  clean = clean.replace(/^#+\s+/gm, '');           // Headers
  clean = clean.replace(/`([^`]+)`/g, '$1');       // Inline code
  clean = clean.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Links
  clean = clean.replace(/!\[.*?\]\(.*?\)/g, '');    // Images
  
  // 5. Remove Table syntax
  clean = clean.replace(/\|/g, ' '); 
  clean = clean.replace(/-{3,}/g, '');

  // 6. Remove excess whitespace
  clean = clean.replace(/\s+/g, ' ').trim();
  
  return clean;
};

// --- Helper: Decode Base64/PCM ---
function base64ToUint8Array(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function pcmToAudioBuffer(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, Math.floor(data.byteLength / 2));
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Convert 16-bit PCM to Float32 (-1.0 to 1.0)
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Helper: Robust Chain of Thought Parsing ---
const parseChainOfThought = (text: string) => {
  // 1. Try XML Tag Parsing (New Robust Method)
  // We extract thinking content first, then treat EVERYTHING else as answer
  const thinkingRegex = /<thinking>([\s\S]*?)<\/thinking>/i;
  const thinkingMatch = text.match(thinkingRegex);

  if (thinkingMatch) {
      const thought = thinkingMatch[1].trim();
      
      // Remove the thinking block from the original text to get the answer candidates
      let remainingText = text.replace(thinkingRegex, '').trim();
      
      // Clean up <answer> tags if they exist
      remainingText = remainingText.replace(/<answer>/i, '').replace(/<\/answer>/i, '').trim();

      return { hasThought: true, thought, answer: remainingText };
  }

  // 2. Streaming State: If we have <thinking> but no closing tag yet
  if (text.trim().toLowerCase().startsWith('<thinking>')) {
      const partialThought = text.replace(/<thinking>/i, '').trim();
      return { hasThought: true, thought: partialThought, answer: '' };
  }

  // 3. Fallback to Legacy Parsing (PART 1 / PART 2)
  const upperText = text.toUpperCase();
  const part1Marker = "PART 1: THE THINKING SPACE";
  const part2Marker = "PART 2: THE FINAL EXECUTION";

  const p1Index = upperText.indexOf(part1Marker);
  const p2Index = upperText.indexOf(part2Marker);

  if (p1Index !== -1 && p2Index !== -1 && p2Index > p1Index) {
    let thought = text.substring(p1Index + part1Marker.length, p2Index).trim();
    let answer = text.substring(p2Index + part2Marker.length).trim();

    thought = thought.replace(/^[\*\#\-\s]+/, '').trim();
    const codeBlockMatch = answer.match(/^```(?:markdown|md|text)?\s*([\s\S]*?)\s*```$/i);
    if (codeBlockMatch) {
        answer = codeBlockMatch[1].trim();
    }
    return { hasThought: true, thought: thought, answer: answer };
  }
  
  return { hasThought: false, thought: '', answer: text };
};

// --- Component: Thinking Box (CoT) ---
const ThinkingBox: React.FC<{ thought: string, labels: any, isThinking: boolean }> = ({ thought, labels, isThinking }) => {
  const [isOpen, setIsOpen] = useState(true); // Default open while generating
  const duration = Math.max(1.2, (thought.length / 100)).toFixed(1);

  // Auto-collapse when done thinking (optional UX choice)
  useEffect(() => {
     if (!isThinking && thought.length > 500) {
         setIsOpen(false);
     }
  }, [isThinking]);

  return (
    <div className="mb-4 w-full animate-in fade-in slide-in-from-top-2 duration-500">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border w-full md:w-auto cursor-pointer select-none ${
          isOpen 
            ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm' 
            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        }`}
      >
        <div className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
           <Brain size={14} className={isThinking ? "animate-pulse" : ""} />
        </div>
        <div className="flex flex-col items-start text-left">
            <span className="leading-none">{labels.thinkingProcess}</span>
            <span className="text-[9px] opacity-60 font-medium mt-0.5">
                {isThinking ? "Processing..." : `${duration}s`}
            </span>
        </div>
        <ChevronDown size={14} className={`ml-auto md:ml-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[800px] opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#F8F9FA] rounded-xl border border-gray-200/80 p-4 text-xs font-mono text-gray-700 leading-relaxed shadow-inner overflow-x-auto relative">
           <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/20"></div>
           <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200/60 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <Cpu size={12} /> {labels.analysisLog}
           </div>
           <ReactMarkdown>{thought}</ReactMarkdown>
           {isThinking && <span className="inline-block w-2 h-4 ml-1 bg-purple-500 animate-pulse align-middle"></span>}
        </div>
      </div>
    </div>
  );
};

// --- Internal Component: Typewriter Effect ---
const TypewriterLabel: React.FC<{ phrases: string[] }> = ({ phrases }) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;
    if (currentPhraseIndex >= phrases.length) {
        setCurrentPhraseIndex(0);
        setCharIndex(0);
        setDisplayedText('');
        return;
    }

    const currentFullText = phrases[currentPhraseIndex];
    if (!currentFullText) return; 

    if (isFadingOut) {
      const fadeTimeout = setTimeout(() => {
        setIsFadingOut(false);
        setDisplayedText('');
        setCharIndex(0);
        if (currentPhraseIndex < phrases.length - 1) {
            setCurrentPhraseIndex(prev => prev + 1);
        }
      }, 500); 
      return () => clearTimeout(fadeTimeout);
    }

    if (charIndex < currentFullText.length) {
      const typeTimeout = setTimeout(() => {
        setDisplayedText(prev => prev + currentFullText[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 40); 
      return () => clearTimeout(typeTimeout);
    } else {
      if (currentPhraseIndex < phrases.length - 1) {
        const holdTimeout = setTimeout(() => {
          setIsFadingOut(true);
        }, 1500); 
        return () => clearTimeout(holdTimeout);
      }
    }
  }, [charIndex, currentPhraseIndex, phrases, isFadingOut]);

  return (
    <span className={`text-xs font-medium transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// --- Helper Icon for Files ---
const FileIconDisplay = ({ mimeType, type }: { mimeType: string, type: string }) => {
    if (type === 'image') return <ImageIcon size={20} className="text-purple-500" />;
    if (type === 'video') return <Video size={20} className="text-pink-500" />;
    if (mimeType.includes('pdf')) return <FileText size={20} className="text-red-500" />;
    if (mimeType.includes('sheet') || mimeType.includes('csv') || mimeType.includes('excel')) return <FileSpreadsheet size={20} className="text-green-500" />;
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return <FileChartColumn size={20} className="text-orange-400" />;
    return <FileText size={20} className="text-blue-500" />;
};

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, loadingState = 'idle', currentModel, onEditMessage, translations }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Audio State
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [audioLoadingId, setAudioLoadingId] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const t = translations.messageList;

  useEffect(() => {
    setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages, isLoading, editingId, loadingState]); 

  useEffect(() => {
    return () => {
        if (sourceNodeRef.current) sourceNodeRef.current.stop();
        if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const thinkingPhrases = t.thinking;
  const searchPhrases = t.searching;
  const youtubePhrases = t.youtube;
  const activePhrases = thinkingPhrases;

  const handleStartEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditText(msg.text);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = (id: string) => {
    if (editText.trim()) {
      onEditMessage(id, editText);
      setEditingId(null);
      setEditText('');
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
        try { sourceNodeRef.current.stop(); } catch(e) {}
        sourceNodeRef.current = null;
    }
    setSpeakingId(null);
    setAudioLoadingId(null);
  };

  const handleSpeak = async (text: string, id: string) => {
    // If currently loading this message, ignore
    if (audioLoadingId === id) return;
    
    // If currently speaking this message, stop it
    if (speakingId === id) {
        stopAudio();
        return;
    }
    
    // Stop any other audio
    stopAudio();
    setAudioLoadingId(id);

    try {
        // Clean text and ensure it's not too long for the API in one go
        const cleanText = cleanMarkdownForSpeech(text);
        if (!cleanText) throw new Error("No readable text found.");

        const base64Audio = await generateSpeechFromGemini(cleanText);
        if (!base64Audio) throw new Error("No audio data returned from AI.");

        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        // Ensure AudioContext is resumed (browser policy)
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        const audioCtx = audioContextRef.current;
        const rawBytes = base64ToUint8Array(base64Audio);
        const audioBuffer = await pcmToAudioBuffer(rawBytes, audioCtx);

        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.onended = () => {
            setSpeakingId(null);
            sourceNodeRef.current = null;
        };
        sourceNodeRef.current = source;
        source.start();
        setSpeakingId(id);
    } catch (error) {
        console.error("Failed to play audio:", error);
        alert("Gagal memutar suara. Pastikan teks tidak terlalu panjang.");
    } finally {
        setAudioLoadingId(null);
    }
  };

  const handleLike = (id: string) => {
    setLikedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleShare = async (text: string) => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Velicia AI Chat', text: text }); } catch (err) {}
    } else {
      alert("Fitur share tidak didukung di browser ini.");
    }
  };

  if (messages.length === 0) return null;

  return (
    <div className="flex flex-col space-y-8 pb-4">
      {messages.map((msg, index) => {
        const isLatest = index === messages.length - 1;
        const { hasThought, thought, answer } = (msg.role === Role.MODEL) 
            ? parseChainOfThought(msg.text) 
            : { hasThought: false, thought: '', answer: msg.text };

        // Determine if we are still "thinking" in the UI sense
        // True if it is the latest message, it is loading, and the answer is empty
        const isGeneratingThought = isLoading && isLatest && hasThought && !answer;

        return (
        <div key={msg.id} className={`flex w-full group ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex flex-col ${msg.role === Role.USER ? 'items-end text-gray-800 text-right max-w-[90%] md:max-w-[80%]' : `items-start text-gray-900 text-left max-w-[90%] md:max-w-[85%]`}`}>
            
            {/* User Attachment Display */}
            {msg.role === Role.USER && msg.attachments && msg.attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2 justify-end animate-in fade-in zoom-in-95 duration-500">
                {msg.attachments.map((att, idx) => (
                    <div key={idx} className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center group/file">
                        {att.type === 'image' ? (
                            <div className="max-w-[120px] md:max-w-[160px]">
                                <img src={att.content} alt="Attachment" className="w-full h-auto object-cover rounded-xl" />
                            </div>
                        ) : att.type === 'video' ? (
                             <div className="max-w-[160px] aspect-video bg-black flex items-center justify-center rounded-xl">
                                <Video className="text-white" size={24} />
                             </div>
                        ) : (
                            <div className="flex items-center gap-2 p-2.5 min-w-[140px] bg-white rounded-xl">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                    <FileIconDisplay mimeType={att.mimeType} type={att.type} />
                                </div>
                                <div className="flex flex-col text-left overflow-hidden">
                                    <span className="text-xs font-bold text-gray-900 truncate max-w-[100px]">{att.name || "Document"}</span>
                                    <span className="text-[9px] text-gray-500 uppercase">{att.mimeType.split('/')[1] || 'FILE'}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
              </div>
            )}

            {/* MESSAGE CONTAINER */}
            {msg.role === Role.MODEL ? (
               <div className="relative w-full">
                 <div className="flex items-center gap-2.5 mb-3 ml-1 animate-in fade-in duration-300">
                     <img src="/logo-app.png" alt="Velicia" className="w-7 h-7 object-contain drop-shadow-sm" />
                     <span className="text-sm md:text-base font-bold text-gray-900 tracking-tight">Velicia</span>
                 </div>

                 {hasThought && <ThinkingBox thought={thought} labels={t} isThinking={isGeneratingThought} />}

                 {/* Show Answer Content */}
                 {(answer || (!hasThought && msg.text)) && (
                    <div className={`prose prose-slate max-w-none 
                    prose-p:leading-relaxed prose-p:text-gray-800 prose-p:text-[15px]
                    prose-headings:font-bold prose-headings:text-gray-900
                    prose-code:font-mono prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-[#1a1a1a] prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-3
                    prose-img:rounded-2xl prose-img:shadow-md
                    animate-in fade-in slide-in-from-bottom-2 duration-1000 fill-mode-both
                    ${hasThought ? 'delay-200' : ''} 
                    `}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                table: ({node, ...props}) => (
                                    <div className="overflow-x-auto my-6 rounded-xl border border-gray-200 shadow-sm bg-white">
                                        <table className="min-w-full divide-y divide-gray-200" {...props} />
                                    </div>
                                ),
                                thead: ({node, ...props}) => (
                                    <thead className="bg-gray-50/80" {...props} />
                                ),
                                tbody: ({node, ...props}) => (
                                    <tbody className="bg-white divide-y divide-gray-100" {...props} />
                                ),
                                tr: ({node, ...props}) => (
                                    <tr className="hover:bg-purple-50/30 transition-colors duration-150" {...props} />
                                ),
                                th: ({node, ...props}) => (
                                    <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap" {...props} />
                                ),
                                td: ({node, ...props}) => (
                                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap md:whitespace-normal leading-relaxed" {...props} />
                                )
                            }}
                        >
                            {answer || (!hasThought ? msg.text : "")}
                        </ReactMarkdown>
                    </div>
                 )}
                 
                 {/* GROUNDING SOURCES */}
                 {msg.groundingMetadata && msg.groundingMetadata.groundingChunks?.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100 animate-in fade-in duration-1000 delay-700">
                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-700">
                             <div className="p-1 bg-blue-50 rounded-full"><Globe size={12} className="text-blue-600"/></div>
                             <span>{t.source}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {msg.groundingMetadata.groundingChunks.map((chunk, idx) => {
                                if (!chunk.web) return null;
                                const domain = new URL(chunk.web.uri).hostname.replace('www.', '');
                                const youtubeId = getYoutubeId(chunk.web.uri);

                                if (youtubeId) {
                                    return (
                                        <a 
                                            key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer"
                                            className="flex flex-col p-0 bg-white border border-gray-200 rounded-xl hover:border-red-300 hover:shadow-md transition-all duration-300 w-[180px] no-underline group/card overflow-hidden"
                                        >
                                            <div className="w-full h-[100px] bg-gray-200 relative">
                                                <img src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`} alt="Thumbnail" className="w-full h-full object-cover"/>
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/card:bg-black/10 transition-colors">
                                                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shadow-lg"><Play size={10} fill="white" className="text-white ml-0.5" /></div>
                                                </div>
                                            </div>
                                            <div className="p-2">
                                                <div className="text-[10px] font-bold text-gray-800 line-clamp-2 mb-1 leading-tight group-hover/card:text-red-600 transition-colors">{chunk.web.title}</div>
                                            </div>
                                        </a>
                                    );
                                }
                                return (
                                    <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-300 max-w-[240px] no-underline group/card">
                                        <div className="w-6 h-6 rounded-md bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center">
                                            <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="icon" className="w-4 h-4 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }}/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[10px] font-bold text-gray-800 truncate group-hover/card:text-blue-600 transition-colors">{chunk.web.title}</div>
                                        </div>
                                        <ExternalLink size={10} className="text-gray-300 group-hover/card:text-blue-400" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                 )}

                 {(!isLoading || !isLatest) && Boolean(answer || (!hasThought && msg.text)) && (
                   <div className="flex items-center gap-2 mt-3 pt-1 animate-in fade-in duration-700 delay-500">
                      <button 
                          onClick={() => handleSpeak(answer || msg.text, msg.id)}
                          disabled={audioLoadingId !== null && audioLoadingId !== msg.id}
                          className={`flex items-center gap-1 text-[10px] font-medium transition-colors p-1 rounded-md hover:bg-gray-100 ${speakingId === msg.id ? 'text-purple-600 bg-purple-50' : 'text-gray-400 hover:text-gray-600'}`}
                          title={speakingId === msg.id ? t.stop : t.listen}
                      >
                          {audioLoadingId === msg.id ? <Loader2 size={12} className="animate-spin text-purple-600" /> : speakingId === msg.id ? <StopCircle size={12} className="fill-current"/> : <Volume2 size={12} />}
                          {audioLoadingId === msg.id ? "Loading..." : speakingId === msg.id ? t.stop : t.listen}
                      </button>
                      <button onClick={() => handleCopy(msg.text, msg.id)} className="flex items-center gap-1 text-[10px] font-medium text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100">
                          {copiedId === msg.id ? <Check size={12} className="text-green-500"/> : <Copy size={12} />}
                          {copiedId === msg.id ? t.copied : t.copy}
                      </button>
                      <button onClick={() => handleLike(msg.id)} className={`flex items-center gap-1 text-[10px] font-medium transition-colors p-1 rounded-md hover:bg-gray-100 ${likedMessages.has(msg.id) ? 'text-pink-600' : 'text-gray-400 hover:text-gray-600'}`}><ThumbsUp size={12} className={likedMessages.has(msg.id) ? 'fill-current' : ''} /></button>
                      <button onClick={() => handleShare(msg.text)} className="flex items-center gap-1 text-[10px] font-medium text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"><Share2 size={12} /></button>
                   </div>
                 )}
               </div>
            ) : (
              <div className="group relative animate-in fade-in slide-in-from-bottom-2 duration-500">
                {editingId === msg.id ? (
                  <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-md min-w-[280px] md:min-w-[400px]">
                     <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full text-gray-800 bg-transparent resize-none outline-none text-sm mb-2" rows={3} autoFocus />
                     <div className="flex justify-end gap-2">
                        <button onClick={handleCancelEdit} className="px-2 py-1 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">{t.cancel}</button>
                        <button onClick={() => handleSaveEdit(msg.id)} disabled={!editText.trim() || editText === msg.text} className="px-2 py-1 text-xs font-bold text-white bg-black hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{t.save}</button>
                     </div>
                  </div>
                ) : (
                    <div className="relative group">
                         {msg.text && (
                            <div className="bg-gray-100/50 hover:bg-gray-100 transition-colors py-2 px-4 rounded-[18px] text-gray-800 text-[15px] inline-block text-left break-words">
                                {msg.text}
                            </div>
                         )}
                         <button onClick={() => handleStartEdit(msg)} className="absolute -left-7 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"><Edit2 size={12} /></button>
                    </div>
                )}
              </div>
            )}
          </div>
        </div>
      )})}
      
      {isLoading && (
           <div className="flex items-center justify-start w-full pl-0 mt-4 h-12 relative overflow-visible animate-in fade-in duration-500 gap-4">
                <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
                    <div className="transform scale-[0.4] origin-center">
                        <div className="loader">
                            <svg width="100" height="100" viewBox="0 0 100 100">
                                <defs>
                                <mask id="clipping">
                                    <polygon points="0,0 100,0 100,100 0,100" fill="black"></polygon>
                                    <polygon points="25,25 75,25 50,75" fill="white"></polygon>
                                    <polygon points="50,25 75,75 25,75" fill="white"></polygon>
                                    <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                                    <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                                    <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                                    <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                                </mask>
                                </defs>
                            </svg>
                            <div className="box"></div>
                        </div>
                    </div>
                </div>

                <div className={`transition-colors duration-700 ease-in-out mt-1 ${
                    loadingState === 'searching' 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#DB4437] to-[#F4B400]' 
                    : loadingState === 'youtube_search'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400'
                    : 'text-gray-400'
                }`}>
                    {loadingState === 'searching' ? (
                        <TypewriterLabel phrases={searchPhrases} key="search" />
                    ) : loadingState === 'youtube_search' ? (
                        <TypewriterLabel phrases={youtubePhrases} key="youtube" />
                    ) : (
                        <TypewriterLabel phrases={activePhrases} key="thinking" />
                    )}
                </div>
           </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
