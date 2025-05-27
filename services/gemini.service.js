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
    const answer = await getAnswer(
      `Help me answer customer feedback about the product on the wildberries e-commerce site in russian, just return me the answer: question: ${feedback.text}, product: ${feedback.productDetails.productName}, product valuation ${feedback.productValuation}, color ${feedback.color}, id ${feedback.productDetails.nmId}`,
    );
    return removeMarkdown(answer);
  } catch (error) {
    console.error("Error get answer:", error);
    throw new Error(`Error get answer: ${error}`);
  }
};

const recommendReplyQuestion = async (question) => {
  try {
    const answer =
      await getAnswer(`You are a professional customer support agent for the Russian e-commerce platform Wildberries. 
      Answer the customer's question in Russian, ensuring the response is polite, professional, and follows Wildberries' guidelines. 
      Use the following product details to provide accurate information:
      - Product: ${question.productDetails.productName}
      - Brand: ${question.productDetails.brandName}
      - Арт. продавца: ${question.productDetails.supplierArticle}
      - Артикул WB: ${question.productDetails.nmId}
      - Customer question: ${question.text}`);
    return removeMarkdown(answer);
  } catch (error) {
    console.error("Error get answer:", error);
    throw new Error(`Error get answer: ${error}`);
  }
};

module.exports = { getAnswer, recommendReplyFeedback, recommendReplyQuestion };