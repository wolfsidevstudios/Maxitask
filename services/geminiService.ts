
import { Category, Task, Note } from "../types";

// AI Functionality removed. This service now just passes input through or returns empty responses.

const parseTaskWithGemini = async (input: string, currentCategory: Category, availableCategories: string[], apiKey?: string): Promise<Partial<Task>> => {
  // Simple pass-through without AI
  return {
    title: input,
    category: currentCategory,
    completed: false,
  };
};

export interface AIResponse {
  type: 'mixed' | 'chat';
  message: string;
  newTasks: Partial<Task>[];
  newNote?: Partial<Note>;
}

const processGeneralAIRequest = async (input: string, availableCategories: string[], apiKey?: string): Promise<AIResponse> => {
  return {
    type: 'chat',
    message: "AI functionality has been disabled.",
    newTasks: []
  };
};

export { parseTaskWithGemini, processGeneralAIRequest };
