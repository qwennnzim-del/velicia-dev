
import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, AudioLines, ArrowUp, ChevronUp, X, FileText, Image as ImageIcon, FileSpreadsheet, FileIcon, Sparkles, Video, FileChartColumn } from 'lucide-react';
import { ModelOption, Attachment } from '../types';

interface InputAreaProps {
  onSend: (text: string, modelId: string, attachments?: Attachment[]) => void;
  isLoading: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
  availableModels: ModelOption[];
  translations: any;
}

const BrandIcon: React.FC<{ brand: string, className?: string }> = ({ className = "w-6 h-6" }) => {
  return (
    <Sparkles className={`${className} text-[#7928CA]`} strokeWidth={2.5} />
  );
};

const InputArea: React.FC<InputAreaProps> = ({ 
  onSend, 
  isLoading, 
  selectedModel, 
  onModelChange,
  availableModels,
  translations
}) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations.input;

  const activeModelOption = availableModels.find(m => m.id === selectedModel);
  const activeModelLabel = activeModelOption?.label || selectedModel;

  const handleSend = () => {
    if ((!text.trim() && attachments.length === 0) || isLoading) return;
    onSend(text, selectedModel, attachments.length > 0 ? attachments : undefined);
    setText('');
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const triggerInput = (type: string) => {
    if (fileInputRef.current) {
        if (type === 'image') fileInputRef.current.accept = "image/*";
        else if (type === 'video') fileInputRef.current.accept = "video/*";
        else fileInputRef.current.accept = "application/pdf,text/plain,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";
        
        fileInputRef.current.click();
    }
    setIsAttachmentMenuOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxFiles = 5;
    const remainingSlots = maxFiles - attachments.length;
    
    if (remainingSlots <= 0) {
        alert(t.maxFiles);
        return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    
    filesToProcess.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            let type: Attachment['type'] = 'file';
            if (file.type.startsWith('image/')) type = 'image';
            else if (file.type.startsWith('video/')) type = 'video';
            else if (file.type.startsWith('audio/')) type = 'audio';

            setAttachments(prev => [...prev, {
                type: type,
                content: event.target?.result as string,
                mimeType: file.type,
                name: file.name
            }]);
        };
        reader.readAsDataURL(file);
    });

    // Reset input value to allow selecting the same file again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (mimeType: string, type: string) => {
      if (type === 'image') return <ImageIcon size={16} className="text-purple-500" />;
      if (type === 'video') return <Video size={16} className="text-pink-500" />;
      if (type === 'audio') return <AudioLines size={16} className="text-orange-500" />;
      
      if (mimeType.includes('pdf')) return <FileText size={16} className="text-red-500" />;
      if (mimeType.includes('sheet') || mimeType.includes('csv') || mimeType.includes('excel')) return <FileSpreadsheet size={16} className="text-green-500" />;
      if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return <FileChartColumn size={16} className="text-orange-400" />;
      
      return <FileIcon size={16} className="text-blue-500" />;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsModelMenuOpen(false);
      }
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target as Node)) {
        setIsAttachmentMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-3 pb-2 md:pb-6">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        multiple
        // Support: Images, Videos, Audio, PDF, Word, Excel, PowerPoint, Text, CSV
        accept="image/*,video/*,audio/*,application/pdf,text/plain,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" 
        onChange={handleFileChange}
      />

      <div className={`relative p-[1.5px] rounded-3xl transition-all duration-500 bg-white z-10 ${isFocused ? 'shadow-[0_5px_20px_-3px_rgba(236,72,153,0.15)] focus-within:shadow-[0_5px_20px_-3px_rgba(59,130,246,0.15)]' : 'shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]'}`}>
        
        {/* Animated Glow & Border Layer */}
        <div className={`absolute inset-0 overflow-hidden rounded-3xl transition-opacity duration-700 pointer-events-none z-0 ${isFocused ? 'opacity-100' : 'opacity-0'}`}>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] lg:w-[1500px] lg:h-[1500px] bg-[conic-gradient(from_0deg,transparent_0_75%,#3b82f6_85%,#ec4899_93%,#f97316_100%)]" style={{ animation: 'spin 3s linear infinite' }} />
        </div>
        {!isFocused && <div className="absolute inset-0 border border-gray-100 rounded-3xl pointer-events-none z-10" />}

        {/* Content Container */}
        <div className="relative bg-white rounded-[22.5px] w-full h-full p-1.5 md:p-2 z-10 flex flex-col">
          
        {/* Attachment Preview Rail */}
        {attachments.length > 0 && (
          <div className="px-3 pt-2 pb-1 flex gap-2 overflow-x-auto no-scrollbar">
            {attachments.map((att, idx) => (
                <div key={idx} className="relative group shrink-0">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex flex-col items-center justify-center relative">
                        {att.type === 'image' ? (
                            <img src={att.content} alt="Preview" className="w-full h-full object-cover" />
                        ) : att.type === 'video' ? (
                            <div className="w-full h-full bg-black flex items-center justify-center">
                                <Video size={20} className="text-white" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-1 w-full text-center h-full">
                                {getFileIcon(att.mimeType, att.type)}
                                <span className="text-[8px] text-gray-500 font-medium truncate w-full mt-1 px-1">{att.name}</span>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => removeAttachment(idx)} 
                        className="absolute -top-1.5 -right-1.5 bg-gray-800 text-white rounded-full p-0.5 shadow-md hover:bg-red-500 transition-colors z-10"
                    >
                        <X size={10} strokeWidth={2} />
                    </button>
                </div>
            ))}
          </div>
        )}

        <div className={`px-3 pb-1 ${attachments.length > 0 ? 'pt-1' : 'pt-2'}`}>
          <textarea
            id="tour-input"
            ref={textareaRef}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={attachments.length > 0 ? t.placeholderFile : t.placeholder}
            disabled={isLoading}
            rows={1}
            className="w-full resize-none text-gray-800 placeholder-gray-400 bg-transparent border-none focus:ring-0 focus:outline-none text-sm max-h-[120px] overflow-y-auto no-scrollbar"
            style={{ minHeight: '20px' }}
          />
        </div>

        <div className="flex items-center justify-between px-1 pb-1 mt-1">
          <div className="flex items-center gap-1 md:gap-2">
            <div>
                <button
                    id="tour-model-selector"
                    onClick={() => setIsModelMenuOpen(true)}
                    className="flex items-center space-x-1.5 hover:bg-gray-100 text-gray-700 py-1.5 px-2.5 rounded-full transition-all border border-gray-100 bg-gradient-to-r from-purple-50/50 to-pink-50/50"
                >
                    <BrandIcon brand="velicia" className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <div className="flex flex-col items-start text-left leading-tight pr-0.5">
                        <span className="font-bold text-[10px] whitespace-nowrap">{activeModelLabel}</span>
                    </div>
                    <ChevronUp size={10} className={`text-gray-400 transition-transform duration-200 ${isModelMenuOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <div className="relative" ref={attachmentMenuRef}>
              <button 
                id="tour-attachments" 
                onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 md:p-2 transition-colors relative" 
                title="Upload"
              >
                <Paperclip className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={2} />
                {attachments.length > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
              
              {isAttachmentMenuOpen && (
                <div className="absolute bottom-full right-0 mb-3 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-30 p-2 flex flex-col gap-1 w-40 animate-in fade-in slide-in-from-bottom-2 duration-200 origin-bottom-right">
                   <button onClick={() => triggerInput('file')} className="flex items-center gap-3 p-2.5 hover:bg-gray-50 active:bg-gray-100 rounded-xl text-sm text-gray-700 transition-colors text-left w-full active:scale-[0.98]">
                       <FileText size={18} className="text-blue-500 shrink-0" />
                       <span className="font-medium truncate text-xs">Dokumen</span>
                   </button>
                   <button onClick={() => triggerInput('image')} className="flex items-center gap-3 p-2.5 hover:bg-gray-50 active:bg-gray-100 rounded-xl text-sm text-gray-700 transition-colors text-left w-full active:scale-[0.98]">
                       <ImageIcon size={18} className="text-purple-500 shrink-0" />
                       <span className="font-medium truncate text-xs">Gambar</span>
                   </button>
                   <button onClick={() => triggerInput('video')} className="flex items-center gap-3 p-2.5 hover:bg-gray-50 active:bg-gray-100 rounded-xl text-sm text-gray-700 transition-colors text-left w-full active:scale-[0.98]">
                       <Video size={18} className="text-pink-500 shrink-0" />
                       <span className="font-medium truncate text-xs">Video</span>
                   </button>
                </div>
              )}
            </div>
            <button
              onClick={handleSend}
              disabled={(!text.trim() && attachments.length === 0) || isLoading}
              className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full transition-all duration-300 ${ (text.trim() || attachments.length > 0) && !isLoading ? 'bg-black text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
              {isLoading ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <ArrowUp className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={3} />}
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Slide-up Model Selector (Bottom Sheet) */}
      {isModelMenuOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsModelMenuOpen(false)}>
          <div 
            className="w-full max-w-2xl bg-white rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <span className="font-bold text-gray-900 text-sm">Gen2 V5 Pro</span>
                <button onClick={() => setIsModelMenuOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 p-2 rounded-full transition-colors active:scale-95"><X size={16} /></button>
            </div>
            <div className="p-4 pb-8 flex flex-col gap-2">
                {availableModels.map((model) => (
                    <button
                    key={model.id}
                    onClick={() => {
                        onModelChange(model.id);
                        setIsModelMenuOpen(false);
                    }}
                    className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 border ${selectedModel === model.id ? 'bg-purple-50/50 border-purple-200 ring-2 ring-purple-100' : 'bg-white hover:bg-gray-50 active:bg-gray-100 border-gray-100'} flex items-center justify-between group active:scale-[0.98]`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl flex items-center justify-center transition-colors ${selectedModel === model.id ? 'bg-white shadow-sm' : 'bg-gray-50 group-hover:bg-white group-hover:shadow-sm'}`}>
                            <BrandIcon brand="velicia" className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <div>
                            <div className="font-bold text-gray-900 text-sm md:text-base mb-0.5">
                                {model.label}
                            </div>
                            {model.description && <div className="text-xs text-gray-500">{model.description}</div>}
                        </div>
                    </div>
                    {selectedModel === model.id && (
                        <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                    )}
                </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputArea;
