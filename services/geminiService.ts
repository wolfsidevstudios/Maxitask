
import { GoogleGenAI, Type } from "@google/genai";
import { Category, Task, Note } from "../types";

const parseTaskWithGemini = async (input: string, currentCategory: Category, availableCategories: string[], apiKey?: string): Promise<Partial<Task>> => {
  const keyToUse = apiKey;

  if (!keyToUse) {
    console.warn("API_KEY is missing, returning mock parsed task.");
    return {
      title: input,
      category: currentCategory,
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: keyToUse });
    
    // We want the model to return a JSON object structured like a Task
    // Dynamically include available categories in the prompt and schema
    const categoriesList = availableCategories.join(", ");
    const today = new Date().toISOString().split('T')[0];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Extract task details from this user input: "${input}". 
      Current context category is "${currentCategory}".
      Available categories are: ${categoriesList}.
      Today is ${today}.
      If the user specifies a time (like "at 5pm", "tomorrow morning", "remind me at 14:00"), extract it in 24h format (HH:MM).
      If the user specifies a date (like "tomorrow", "next friday", "oct 20"), extract it as YYYY-MM-DD string.
      If the user specifies one of the available categories, use it. Otherwise, use the current context.
      Return JSON only.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The core task action text" },
            category: { type: Type.STRING, enum: availableCategories },
            time: { type: Type.STRING, description: "Time in HH:MM format if specified, else null", nullable: true },
            date: { type: Type.STRING, description: "Date in YYYY-MM-DD format if specified, else null", nullable: true },
          },
          required: ["title", "category"],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const parsed = JSON.parse(text);
    return {
      title: parsed.title,
      category: parsed.category as Category,
      time: parsed.time || undefined,
      date: parsed.date || undefined,
      completed: false,
    };

  } catch (error) {
    console.error("Gemini parse error:", error);
    // Fallback
    return {
      title: input,
      category: currentCategory,
      completed: false,
    };
  }
};

export interface AIResponse {
  type: 'mixed' | 'chat';
  message: string;
  newTasks: Partial<Task>[];
  newNote?: Partial<Note>;
}

const processGeneralAIRequest = async (input: string, availableCategories: string[], apiKey?: string): Promise<AIResponse> => {
  const keyToUse = apiKey;

  if (!keyToUse) {
     // Mock fallback
     return {
         type: 'chat',
         message: "I can't connect to my brain right now (Missing API Key). Please add your API Key in Settings > Intelligence.",
         newTasks: [],
     };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: keyToUse });
    const categoriesList = availableCategories.join(", ");
    const today = new Date().toISOString().split('T')[0];

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an intelligent productivity assistant for an app called Maxitask.
        User Input: "${input}"
        Available Categories: ${categoriesList}
        Today's Date: ${today}
        
        Analyze the request deeply.
        
        1. LIST BREAKDOWN (CRITICAL): If the user asks for a "list" of things (e.g., "grocery list for pumpkin pie", "packing list for Paris", "steps to build a table"), YOU MUST break it down into specific individual items/ingredients/steps as separate tasks.
           - DO NOT create a single task named "Grocery list".
           - DO create multiple tasks: "Buy Pumpkin", "Buy Crust", "Buy Eggs", etc.
           
        2. REMINDERS & DATES: 
           - If the user asks to "remind me" or specifies a time (e.g., "at 5pm"), set the 'time' field in HH:MM (24h) format.
           - If the user specifies a date (e.g. "on Friday", "tomorrow", "Dec 25th"), set the 'date' field in YYYY-MM-DD format.
        
        3. NOTES: If the user wants to write a draft, summary, idea, or long-form text, create a Note.
        
        4. CHAT: If the user just says hello or asks a question, just provide a 'message'.

        Always provide a short, encouraging 'message' summary of what you did (e.g., "I've added 6 ingredients to your shopping list.").
        
        Return JSON.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    message: { type: Type.STRING, description: "Short response to the user." },
                    newTasks: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                category: { type: Type.STRING, enum: availableCategories },
                                time: { type: Type.STRING, nullable: true },
                                date: { type: Type.STRING, nullable: true, description: "YYYY-MM-DD" }
                            },
                            required: ["title", "category"]
                        }
                    },
                    newNote: {
                        type: Type.OBJECT,
                        nullable: true,
                        properties: {
                            title: { type: Type.STRING },
                            content: { type: Type.STRING },
                            category: { type: Type.STRING, enum: availableCategories },
                            date: { type: Type.STRING, nullable: true, description: "YYYY-MM-DD" }
                        },
                        required: ["title", "content", "category"]
                    }
                },
                required: ["message", "newTasks"]
            }
        }
    });
    
    const text = response.text;
    if (!text) throw new Error("No response");
    
    const parsed = JSON.parse(text);
    return {
        type: 'mixed',
        message: parsed.message,
        newTasks: parsed.newTasks || [],
        newNote: parsed.newNote || undefined
    };

  } catch (error) {
    console.error("Gemini AI error", error);
    return {
        type: 'chat',
        message: "I encountered an error processing that request. Please check your API Key in Settings.",
        newTasks: []
    };
  }
};

export { parseTaskWithGemini, processGeneralAIRequest };
