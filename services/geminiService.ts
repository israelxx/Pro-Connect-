
import { GoogleGenAI, Type } from "@google/genai";
import { ClientData, VideoScript } from "../types";

export const generateScripts = async (data: ClientData): Promise<VideoScript[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Gere entre 10 e 15 roteiros de vídeo curto (Reels/TikTok/Shorts) para o seguinte perfil:
  Nome do Cliente: ${data.name}
  Nicho/Área: ${data.niche}
  Instagram: ${data.instagram}
  Objetivos Principais: ${data.objectives.join(', ')}

  Instruções Estratégicas:
  - Cada roteiro deve ser autoral, focado em autoridade e conversão.
  - O "Hook" (Gancho) deve ser irresistível e durar no máximo 3 segundos.
  - O "Body" (Conteúdo) deve entregar valor real ou curiosidade rápida.
  - O "CTA" (Chamada para Ação) deve ser direto e relacionado ao objetivo selecionado.
  - Use ganchos de curiosidade, quebra de padrão ou promessa de benefício.

  Retorne estritamente um JSON seguindo o esquema definido.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              objective: { type: Type.STRING },
              hook: { type: Type.STRING },
              body: { type: Type.STRING },
              cta: { type: Type.STRING }
            },
            required: ["id", "title", "objective", "hook", "body", "cta"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("A IA não retornou conteúdo.");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Erro na geração Gemini:", error);
    throw new Error("Falha ao gerar roteiros. Verifique sua conexão ou tente novamente.");
  }
};
