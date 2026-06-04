
import { Message, Role, ModelType } from '../types';

export const sendToPollinations = async (
  text: string,
  history: Message[],
  systemInstruction: string,
  modelId: string = 'velicia-v5'
): Promise<string> => {
  try {
    // 1. Format Messages for OpenAI-style API
    // Pollinations accepts: [{ role: "system"|"user"|"assistant", content: "..." }]
    const messages = history.map(msg => ({
      role: msg.role === Role.MODEL ? 'assistant' : 'user',
      content: msg.text
    }));

    // Add the new user message
    messages.push({ role: 'user', content: text });

    // Prepend System Instruction
    messages.unshift({ role: 'system', content: systemInstruction });

    // 2. Random Seed for variety (optional but good for uniqueness)
    const seed = Math.floor(Math.random() * 1000000);

    // 3. Map App Model IDs to Pollinations Models
    // 'openai' = GPT-4o (Smartest)
    // 'mistral' = Mistral Large (Fast/Good)
    // 'claude' = Claude 3.5 Sonnet (Reasoning)
    
    let modelName = 'openai'; 
    
    // Map internal IDs to Pollinations provider
    if (modelId === ModelType.GEN2_REASONING) {
        modelName = 'openai'; // Use GPT-4o for "Smart" & "Pro" models
    } else if (modelId === ModelType.GEN2_V2_5) {
        modelName = 'mistral'; // Use Mistral for "Fast" model
    } else if (modelId.includes('claude')) {
        modelName = 'claude';
    }

    // 4. Call Pollinations API
    // Endpoint: https://text.pollinations.ai/
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages,
        model: modelName, 
        seed: seed,
        jsonMode: false
      }),
    });

    if (!response.ok) {
      throw new Error(`Pollinations API Error: ${response.statusText}`);
    }

    // Pollinations returns the text directly as string
    const responseText = await response.text();
    return responseText;

  } catch (error: any) {
    console.error("Pollinations Service Error:", error);
    throw new Error("Gagal terhubung ke jaringan Hybrid AI.");
  }
};
