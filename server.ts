import express from 'express';
import path from 'path';
import { GoogleGenAI, Modality } from '@google/genai';
import { CONFIG } from './config';

const app = express();
export const apiRouter = express.Router();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

const getGeminiModelName = (modelId: string) => {
    return 'gemini-2.5-flash';
};

apiRouter.post('/chat', async (req, res) => {
    try {
        let apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
        if (apiKey) {
            apiKey = apiKey.trim();
            if (apiKey.startsWith('"') && apiKey.endsWith('"')) apiKey = apiKey.slice(1, -1);
            if (apiKey.startsWith("'") && apiKey.endsWith("'")) apiKey = apiKey.slice(1, -1);
        }

        if (!apiKey) {
            return res.status(401).json({ error: 'API_KEY is missing in environment variables.' });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

        const { text, modelId, history, attachments } = req.body;

        let historyMessages = history ? history.slice(0, -1) : [];
        const MAX_HISTORY_MESSAGES = 10;
        if (historyMessages.length > MAX_HISTORY_MESSAGES) {
            historyMessages = historyMessages.slice(-MAX_HISTORY_MESSAGES);
        }

        const sdkHistory = [];
        for (const msg of historyMessages) {
            const parts = [];
            if (msg.attachments && msg.attachments.length > 0) {
                for (const att of msg.attachments) {
                    if (att.content.startsWith('data:')) {
                        const base64Data = att.content.split(',')[1];
                        parts.push({ inlineData: { mimeType: att.mimeType, data: base64Data } });
                    }
                }
            }
            if (msg.text) {
                const MAX_CHAR_PER_MSG = 2000;
                let content = msg.text;
                if (content.length > MAX_CHAR_PER_MSG) {
                    content = content.substring(0, MAX_CHAR_PER_MSG) + "... (truncated for efficiency)";
                }
                parts.push({ text: content });
            }
            sdkHistory.push({ role: msg.role === 'model' ? 'model' : 'user', parts });
        }

        const chatSession = ai.chats.create({
            model: getGeminiModelName(modelId),
            history: sdkHistory,
            config: {
                systemInstruction: CONFIG.SYSTEM_INSTRUCTION,
                maxOutputTokens: 4096, 
            }
        });

        const currentParts = [];
        if (attachments && attachments.length > 0) {
            for (const att of attachments) {
                if (att.content.startsWith('data:')) {
                    const base64Data = att.content.split(',')[1];
                    currentParts.push({ inlineData: { mimeType: att.mimeType, data: base64Data } });
                }
            }
        }
        if (text) {
            currentParts.push({ text: text });
        }
        
        let messageContent: any = text;
        if (currentParts.length > 0) messageContent = currentParts;

        const result = await chatSession.sendMessageStream({ message: messageContent });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const chunk of result) {
            const chunkText = chunk.text || '';
            const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
            res.write(`data: ${JSON.stringify({ text: chunkText, groundingMetadata })}\n\n`);
        }
        
        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error: any) {
        console.error("Stream Error API:", error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
});

apiRouter.post('/tts', async (req, res) => {
    try {
        let apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
        if (apiKey) {
            apiKey = apiKey.trim();
            if (apiKey.startsWith('"') && apiKey.endsWith('"')) apiKey = apiKey.slice(1, -1);
            if (apiKey.startsWith("'") && apiKey.endsWith("'")) apiKey = apiKey.slice(1, -1);
        }

        if (!apiKey) {
            return res.status(401).json({ error: 'API_KEY is missing' });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });
        const { text } = req.body;

        let cleanText = text
            .replace(/[*#_`~]/g, '')
            .replace(/\[.*?\]\(.*?\)/g, '')
            .replace(/https?:\/\/\S+/g, 'link')
            .replace(/\n\n/g, '. '); 
        
        const safeText = cleanText.length > 800 ? cleanText.substring(0, 800) + "..." : cleanText;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: safeText }] }],
            config: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, 
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            res.json({ audio: base64Audio });
        } else {
            res.status(500).json({ error: 'No audio generated' });
        }
    } catch (error: any) {
        console.error("TTS Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.use('/api', apiRouter);

async function startServer() {
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
        const { createServer: createViteServer } = await import('vite');
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });
        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}

// Hanya jalankan server secara mandiri jika tidak di lingkungan Vercel
if (!process.env.VERCEL) {
    startServer();
}

export default app;
