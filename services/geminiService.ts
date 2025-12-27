
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTeamNamesAndMottos = async (groupCount: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `請為 HR 活動生成 ${groupCount} 個具備創意且專業的企業團隊名稱與座右銘（Motto）。請使用繁體中文。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              motto: { type: Type.STRING }
            },
            required: ["name", "motto"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return [];
  } catch (error) {
    console.error("Error generating team names:", error);
    return Array.from({ length: groupCount }, (_, i) => ({
      name: `第 ${i + 1} 組`,
      motto: "卓越協作，共創未來"
    }));
  }
};
