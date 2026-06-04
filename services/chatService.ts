
import { db, auth, uploadFileToStorage } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, getDoc, query, orderBy } from 'firebase/firestore';
import { ChatSession } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- FIRESTORE HELPERS ---

const getCollectionRef = (userId: string) => {
    return collection(db, 'users', userId, 'chats');
};

export const saveChatToFirestore = async (userId: string, session: ChatSession) => {
    if (!userId || !db) return;

    // 1. Buat Deep Copy agar tidak mengubah state UI secara langsung
    const sessionToSave = JSON.parse(JSON.stringify(session));

    // 2. Iterasi setiap pesan untuk mencari Attachment berupa Base64
    for (const msg of sessionToSave.messages) {
        if (msg.attachments && msg.attachments.length > 0) {
            const processedAttachments = [];
            
            for (const att of msg.attachments) {
                // Jika konten masih berupa Base64 (data:image/...), upload ke Storage
                if (att.content && att.content.startsWith('data:')) {
                    try {
                        const fileName = att.name || `file_${Date.now()}`;
                        // Upload dan dapatkan URL publik
                        const downloadUrl = await uploadFileToStorage(userId, att.content, fileName);
                        
                        // Ganti konten Base64 dengan URL
                        processedAttachments.push({ ...att, content: downloadUrl });
                    } catch (e) {
                        console.error("Gagal upload file ke storage, menggunakan fallback base64", e);
                        processedAttachments.push(att);
                    }
                } else {
                    // Jika sudah berupa URL (misal dari load sebelumnya), biarkan
                    processedAttachments.push(att);
                }
            }
            msg.attachments = processedAttachments;
        }
    }

    try {
        const chatRef = doc(db, 'users', userId, 'chats', session.id);
        // Simpan sesi yang attachment-nya sudah diganti URL
        await setDoc(chatRef, sessionToSave, { merge: true });
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${userId}/chats/${session.id}`);
    }
};

export const loadChatsFromFirestore = async (userId: string): Promise<ChatSession[]> => {
    if (!userId || !db) return [];
    try {
        const q = query(getCollectionRef(userId), orderBy('timestamp', 'asc'));
        const querySnapshot = await getDocs(q);
        const chats: ChatSession[] = [];
        querySnapshot.forEach((doc) => {
            chats.push(doc.data() as ChatSession);
        });
        return chats;
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, `users/${userId}/chats`);
        return [];
    }
};

export const deleteChatFromFirestore = async (userId: string, chatId: string) => {
    if (!userId || !db) return;
    try {
        await deleteDoc(doc(db, 'users', userId, 'chats', chatId));
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${userId}/chats/${chatId}`);
    }
};

// --- LOCAL STORAGE HELPERS (Fallback) ---

export const saveChatToLocal = (history: ChatSession[]) => {
    localStorage.setItem('velicia_chat_history', JSON.stringify(history));
};

export const loadChatsFromLocal = (): ChatSession[] => {
    const saved = localStorage.getItem('velicia_chat_history');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse local history", e);
        }
    }
    return [];
};
