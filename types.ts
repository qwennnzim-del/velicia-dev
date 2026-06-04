
export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Attachment {
  type: 'image' | 'file' | 'video' | 'audio';
  content: string; // Base64 string
  mimeType: string;
  name?: string; // Added for document display
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
  groundingSupports?: any[];
  searchEntryPoint?: any;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  attachments?: Attachment[]; // Changed from single attachment to array
  groundingMetadata?: GroundingMetadata;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
  lastModelId?: string; // Track which model was used
}

export interface UserProfile {
  name: string;
  bio: string;
  isLoggedIn: boolean;
  photoURL?: string; // Added photoURL property
}

export enum ModelType {
  // Use internal stable IDs, map to API models in service
  GEN2_REASONING = 'velicia-reasoning', // Deprecated from UI but kept for type safety
  GEN2_V2_5 = 'velicia-flash', // Maps to gemini-2.5-flash
}

export type BrandType = 'velicia';

export interface ModelOption {
  id: string; 
  label: string;
  description?: string;
  category: 'text'; 
  brand: BrandType;
}

export const DEFAULT_MODELS: ModelOption[] = [
  { 
    id: ModelType.GEN2_V2_5, 
    label: 'Standar', 
    description: 'Akses kecepatan tinggi untuk tugas sehari-hari.', 
    category: 'text',
    brand: 'velicia'
  }
];

export interface PresentationConfig {
  topic: string;
  cardCount: number;
  modelId: string;
  imageSource: 'ai_generated' | 'google_search';
  language: string;
}