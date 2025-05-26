const { GoogleGenAI } = require('@google/genai');

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
    }
};

module.exports = { getAnswer };