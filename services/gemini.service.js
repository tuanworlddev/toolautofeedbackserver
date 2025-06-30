const { GoogleGenAI } = require('@google/genai');
const { removeMarkdown } = require('../config/config');

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getAnswer = async (contents) => {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
    });
    return response.text.trim();
  } catch (error) {
    console.error('Error get answer:', error);
    throw new Error(`Error get answer: ${error}`);
  }
};

const recommendReplyFeedback = async (feedback) => {
  try {
    const greeting = feedback.userName ? `Уважаемый ${feedback.userName},` : 'Уважаемый покупатель,';

    const prompt = `Вы — ассистент магазина, представляющего бренд на маркетплейсе Wildberries. Отвечайте на отзыв клиента на русском языке от имени магазина. Ответ должен быть вежливым, профессиональным и соответствовать правилам Wildberries. Используйте следующие данные для персонализированного ответа:  
- Приветствие: ${greeting}  
- Товар: ${feedback.productDetails.productName}  
- Бренд: ${feedback.productDetails.brandName}  
- Оценка товара: ${feedback.productValuation}  
- Цвет: ${feedback.color}  
- ID товара: ${feedback.productDetails.nmId}  
- Отзыв клиента: ${feedback.text}  
Если отзыв отрицательный, предложите решение (например, замена, скидка или инструкция по возврату). Если положительный, выразите благодарность и предложите покупателю ознакомиться с другими товарами. Отвечайте только текстом ответа, без дополнительных комментариев или вариантов.`;
    const answer = await getAnswer(prompt);
    return removeMarkdown(answer);
  } catch (error) {
    console.error("Error get answer:", error);
    throw new Error(`Error get answer: ${error}`);
  }
};

const recommendReplyQuestion = async (question) => {
  try {
    const questionType = question.text.includes('доставка') ? 'delivery' :
      question.text.includes('возврат') ? 'return' :
        question.text.includes('размер') ? 'size' : 'general';

    const prompt = `
      You are a shop assistant representing a store selling on the Russian e-commerce platform Wildberries.
      Answer the customer's question in Russian, using a friendly and helpful tone, as if you are directly communicating on behalf of the store.
      Ensure the response is polite, professional, and aligns with Wildberries' guidelines.
      Use the following details to provide accurate information:
      - Greeting: Уважаемый покупатель,
      - Product: ${question.productDetails.productName}
      - Brand: ${question.productDetails.brandName}
      - Арт. продавца: ${question.productDetails.supplierArticle}
      - Артикул WB: ${question.productDetails.nmId}
      - Customer question: ${question.text}
      - Question type: ${questionType}
      If the question is about delivery, provide estimated delivery times or tracking instructions.
      If about returns, explain the return process per Wildberries' rules.
      If about size, provide sizing guidance or suggest contacting for more details.
      For general questions, provide a helpful answer and encourage further engagement (e.g., invite to view other products).
    `;

    const answer = await getAnswer(prompt);
    return removeMarkdown(answer);
  } catch (error) {
    console.error("Error get answer:", error);
    throw new Error(`Error get answer: ${error}`);
  }
};

module.exports = { getAnswer, recommendReplyFeedback, recommendReplyQuestion };