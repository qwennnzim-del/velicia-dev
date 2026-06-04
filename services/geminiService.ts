import { Message, GroundingMetadata, Attachment, Role } from '../types';

export const IMAGE_MODELS = []; 

export async function* streamMessageToGemini(
  text: string, 
  modelId: string,
  history: Message[],
  attachments?: Attachment[]
): AsyncGenerator<{ text: string; groundingMetadata?: GroundingMetadata }> {
    
    // We already fetch URLs to base64 on client if needed, or backend can do it.
    // Ensure all attachments are data URL base64 before sending
    const processedAttachments = await Promise.all((attachments || []).map(async att => {
        if (att.content.startsWith('http')) {
            try {
                const response = await fetch(att.content);
                const blob = await response.blob();
                const b64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(blob);
                });
                return { ...att, content: b64 };
            } catch (e) {
                console.error("Failed fetching attachment", e);
                return att;
            }
        }
        return att;
    }));

    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text,
            modelId,
            history: history,
            attachments: processedAttachments
        })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        yield { text: `⚠️ Error: ${err.error || response.statusText}` };
        return;
    }

    if (!response.body) {
        yield { text: `⚠️ Error: Response body is empty.` };
        return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const dataStr = line.slice(6);
                    if (dataStr === '[DONE]') {
                        return;
                    }
                    try {
                        const data = JSON.parse(dataStr);
                        if (data.error) {
                            yield { text: `⚠️ Error: ${data.error}` };
                        } else {
                            yield {
                                text: data.text,
                                groundingMetadata: data.groundingMetadata
                            };
                        }
                    } catch (e) {
                        console.error('Failed parsing stream chunk', e, dataStr);
                    }
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}

export const sendMessageToGemini = async (
  text: string, 
  modelId: string,
  history: Message[],
  attachments?: Attachment[]
): Promise<{ text: string; groundingMetadata?: GroundingMetadata }> => {
    let fullText = "";
    let finalMetadata;
    for await (const chunk of streamMessageToGemini(text, modelId, history, attachments)) {
        fullText += chunk.text;
        if (chunk.groundingMetadata) finalMetadata = chunk.groundingMetadata;
    }
    return { text: fullText, groundingMetadata: finalMetadata };
};

export const generatePresentationImage = async (prompt: string): Promise<string> => {
    return ""; 
};

export const generateSpeechFromGemini = async (text: string): Promise<string | undefined> => {
    try {
        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        if (!response.ok) {
            console.error("TTS request failed");
            return undefined;
        }
        const data = await response.json();
        return data.audio;
    } catch (error) {
        console.error("TTS Generation Error:", error);
        throw error;
    }
};
