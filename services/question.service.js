const axios = require('axios');
const geminiAIService = require('./gemini.service');
const { removeMarkdown } = require('../config/config');

const getCountUnanswered = async (apiKey) => {
    try {
        const countResponse = await axios.get('https://feedbacks-api.wildberries.ru/api/v1/questions/count-unanswered', {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            }
        });
        return countResponse.data.data;
    } catch (error) {
        throw new Error(`Error get count unanswer: ${error}`);
    }
}

const getQuestions = async (apiKey, isAnswered, take = 20, skip = 0, order = "dateDesc") => {
    try {
        const response = await axios.get('https://feedbacks-api.wildberries.ru/api/v1/questions', {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            params: {
                isAnswered,
                take,
                skip,
                order,
            },
        });

        return response.data?.data?.questions || [];
    } catch (error) {
        console.error('Error getting questions:', error.response?.data || error.message);
        throw new Error(`Error getting questions: ${error.message}`);
    }
};

const getQuestionById = async (apiKey, questionId) => {
    try {
        const response = await axios.get(`https://feedbacks-api.wildberries.ru/api/v1/question?id=${questionId}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data?.data;
    } catch (error) {
        console.error('Error getting question:', error.response?.data || error.message);
        throw new Error(`Error getting question: ${error.message}`);
    }
};

const replyQuestion = async (apiKey, questionId, answer) => {
    try {
        const response = await axios.patch('https://feedbacks-api.wildberries.ru/api/v1/questions',
            {
                id: questionId,
                state: "wbRu",
                wasViewed: true,
                answer: {
                    text: answer
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.status;
    } catch (error) {
        console.error('Error reply feedback:', error.response?.data || error.message);
        throw error;
    }
}

const handleReplyQuestion = async (shop) => {
    const countResponse = await getCountUnanswered(shop.apiKey);
    const { countUnanswered, countUnansweredToday } = countResponse;
    console.log(`Shop ${shop.name}: ${countUnansweredToday} unanswered today, ${countUnanswered} total`);

    if (countUnanswered === 0) return;

    const questions = await getQuestions(shop.apiKey, false, countUnanswered, 0, "dateAsc");

    let counter = 0;
    for (const question of questions) {
        try {
            counter++;
            console.log('Question counter:', counter);
            let answer = await geminiAIService.recommendReplyQuestion(question);
            console.log('Answer: ', removeMarkdown(answer));
            if (answer) {
                await replyQuestion(shop.apiKey, question.id, answer);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Error processing question ${question.id}:`, error.response?.data || error.message);
        }
    }
}

module.exports = { getCountUnanswered, handleReplyQuestion, getQuestions, getQuestionById, replyQuestion }