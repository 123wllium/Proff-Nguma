
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePost = async (content: string, imageUrl?: string) => {
  const ai = getAI();
  const parts: any[] = [{ text: `Analyze this social media post and provide a short, friendly AI insight or reaction (max 20 words). If there's an image, incorporate its context. Post text: "${content}"` }];
  
  if (imageUrl) {
    const base64Data = imageUrl.split(',')[1];
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg'
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Fascinating post! Sharing is caring.";
  }
};

export const suggestCaption = async (imageUrl: string) => {
  const ai = getAI();
  const base64Data = imageUrl.split(',')[1];
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: "Suggest a catchy social media caption for this image." },
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg'
            }
          }
        ]
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Caption Error:", error);
    return "Check out this photo!";
  }
};

export const getSmartReplies = async (lastMessage: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user received this message: "${lastMessage}". Provide 3 very short, casual social media reply suggestions (1-3 words each). Return them as a comma-separated list.`,
    });
    return response.text?.split(',').map(s => s.trim().replace(/^"|"$/g, '')) || [];
  } catch (error) {
    return ["Nice!", "Cool", "Got it"];
  }
};
