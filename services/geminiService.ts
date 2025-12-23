import { GoogleGenAI } from "@google/genai";
import { Transaction, BudgetCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsight = async (
  transactions: Transaction[],
  budgets: BudgetCategory[],
  totalBalance: number
): Promise<string> => {
  try {
    const transactionSummary = transactions.length > 0
      ? transactions.slice(0, 10).map(t => `${t.title}: ${t.amount} SAR`).join(', ')
      : "No recent transactions recorded.";
      
    const budgetSummary = budgets.map(b => `${b.name}: ${b.spent}/${b.allocated}`).join(', ');

    const prompt = `
      You are a wise and friendly Saudi financial assistant named "Raed" for a user named Mohammed.
      
      Current Financial State:
      - Balance: ${totalBalance} SAR
      - Recent Transactions: ${transactionSummary}
      - Budget Status: ${budgetSummary}
      
      Your Goal:
      Give one specific, short, and encouraging piece of advice in Arabic (Saudi dialect).
      If the user has no transactions yet, encourage them to start tracking.
      If the user is over budget, warn them gently.
      Keep it under 20 words. No Markdown. Just plain text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "سجل مصروفاتك لنساعدك في إدارة ميزانيتك بشكل أفضل!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "نحلل بياناتك حالياً لنعطيك أفضل النصائح...";
  }
};