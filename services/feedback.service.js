const axios = require('axios');
const Shop = require('../models/shop.model');
const geminiAIService = require('./gemini.service');
const { removeMarkdown } = require('../config/config');

const processFeedbacks = async () => {
    try {
        const shops = await Shop.find();
        for (const shop of shops) {
            if (shop.activate && shop.isAuto) {
                await handleShopFeedbacks(shop);
            }
        }
    } catch (error) {
        console.error('Error processing feedbacks:', error);
    }
}

const getFeedbacks = async (apiKey, isAnswered, take = 20, skip = 0, order = "dateDesc") => {
    try {
        const response = await axios.get('https://feedbacks-api.wildberries.ru/api/v1/feedbacks', {
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

        return response.data?.data?.feedbacks || [];
    } catch (error) {
        console.error('Error getting feedbacks:', error.response?.data || error.message);
        throw new Error(`Error getting feedbacks: ${error.message}`);
    }
};

const replyToFeedback = async (apiKey, feedbackId, answer) => {
    try {
        const response = await axios.post('https://feedbacks-api.wildberries.ru/api/v1/feedbacks/answer',
            {
                id: feedbackId,
                text: answer,
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

const generateReply = (feedback) => {
    const productName = feedback.productDetails.productName;
    const brandName = feedback.productDetails.brandName;

    const replies = {
        1: `Уважаемый клиент, благодарим за ваш отзыв о ${productName}. Нам очень жаль, что ваш опыт оказался не таким, как ожидалось. Пожалуйста, напишите нам через систему поддержки клиентов Wildberries, указав номер заказа и детали, чтобы мы могли разобраться в ситуации и предложить решение. Мы ценим ваше мнение и хотим исправить ситуацию. С уважением, Ваш ${brandName}.`,
        2: `Здравствуйте! Спасибо за ваш отзыв о ${productName}. Нам жаль, что что-то могло пойти не так. Пожалуйста, свяжитесь с нами через систему поддержки клиентов Wildberries, указав номер заказа, чтобы мы могли оперативно помочь. Мы готовы улучшить ваш опыт покупок. С уважением, Ваш ${brandName}.`,
        3: `Добрый день! Благодарим за ваш отзыв о ${productName}. Нам важно ваше мнение, и мы хотели бы узнать, как можем сделать ваш опыт лучше. Пожалуйста, напишите нам через систему поддержки клиентов Wildberries, указав номер заказа и ваши пожелания. Будем рады помочь! С уважением, Ваш ${brandName}.`,
        4: `Здравствуйте! Спасибо за ваш отзыв и высокую оценку ${productName}! Нам очень приятно, что вы остались довольны покупкой. Если есть что-то, что мы можем улучшить, пожалуйста, поделитесь своими пожеланиями через систему поддержки клиентов Wildberries. Ждем вас снова! С уважением, Ваш ${brandName}.`,
        5: `Уважаемый клиент, огромное спасибо за 5 звезд для ${productName}! Мы очень рады, что вы остались довольны покупкой. Будем счастливы видеть вас снова на Wildberries! Если у вас есть вопросы или пожелания, пишите нам через систему поддержки клиентов Wildberries. С уважением, Ваш ${brandName}.`
    };

    return replies[feedback.productValuation] || `Спасибо за ваш отзыв! Пожалуйста, свяжитесь с нами через систему поддержки клиентов Wildberries, если у вас есть вопросы или пожелания. С уважением, Ваш ${brandName}`;
}

const getCountUnanswered = async (apiKey) => {
    try {
        const countResponse = await axios.get('https://feedbacks-api.wildberries.ru/api/v1/feedbacks/count-unanswered', {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            }
        });
        return countResponse.data.data;
    } catch (error) {
        throw new Error('Error get count unanswer:', $error);
    }
}

const handleShopFeedbacks = async (shop) => {
    const countResponse = await getCountUnanswered(shop.apiKey);
    const { countUnanswered, countUnansweredToday } = countResponse;
    console.log(`Shop ${shop.name}: ${countUnansweredToday} unanswered today, ${countUnanswered} total`);

    if (countUnanswered === 0) return;

    const feedbacks = await getFeedbacks(shop.apiKey, false, countUnanswered, 0, "dateAsc");

    let counter = 0;
    for (const feedback of feedbacks) {
        try {
            counter++;
            console.log('Feedback counter:', counter);
            let answer = '';
            if (!feedback.text) {
                answer = generateReply(feedback);
            } else {
                answer = await geminiAIService.recommendReplyFeedback(feedback);
            }
            console.log('Question:', feedback.text, 'Product valuation:', feedback.productValuation);
            console.log('Answer: ', answer);
            if (answer) {
                await replyToFeedback(shop.apiKey, feedback.id, answer);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Error processing feedback ${feedback.id}:`, error.response?.data || error.message);
        }
    }
}


module.exports = { processFeedbacks, getCountUnanswered, handleShopFeedbacks, getFeedbacks }