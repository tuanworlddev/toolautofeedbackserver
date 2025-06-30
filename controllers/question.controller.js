const geminiService = require('../services/gemini.service');
const questionService = require('../services/question.service');
const ShopService = require('../services/shop.service');

exports.processOne = async (req, res) => {
    try {
        const shop = await ShopService.getById(req.params.id);
        if (!shop) return res.status(404).json({ message: 'Shop not found' });
        await questionService.handleReplyQuestion(shop);
        res.json({ message: 'Process successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getCountUnanswered = async (req, res) => {
    try {
        const apiKey = req.query.apiKey;
        if (!apiKey) {
            return res.status(400).json({ message: "Missing 'apikey' in query parameters." });
        }
        const response = await questionService.getCountUnanswered(apiKey);
        console.log('Get count questions unanswered:', response.countUnanswered);
        res.json(response);
    } catch (e) {
        res.status(500).json({ message: error.message });
    }
}

exports.getQuestions = async (req, res) => {
    try {
        const { apiKey, isAnswered, take = 20, skip = 0, order = 'dateDesc' } = req.query;

        if (!apiKey) {
            return res.status(400).json({ message: "Missing 'apikey' in query parameters." });
        }

        const questions = await questionService.getQuestions(
            apiKey,
            isAnswered,
            parseInt(take),
            parseInt(skip),
            order
        );

        res.json({ questions });
    } catch (error) {
        console.error('Error in get questions controller:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

exports.getQuestionById = async (req, res) => {
    try {
        const id = req.params.id;
        const { apiKey } = req.query;

        if (!id || !apiKey) {
            return res.status(400).json({ message: "Missing 'id or apikey' in query parameters." });
        }

        const question = await questionService.getQuestionById(apiKey, id);

        res.json({ question });
    } catch (error) {
        console.error('Error in get questions controller:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

exports.recommend = async (req, res) => {
    try {
        const id = req.params.id;
        const { apiKey } = req.query;

        if (!id || !apiKey) {
            return res.status(400).json({ message: "Missing 'id or apikey' in query parameters." });
        }

        const question = await questionService.getQuestionById(apiKey, id);
        const answer = await geminiService.recommendReplyQuestion(question);

        res.json({ answer: answer });
    } catch (error) {
        console.error('Error in get questions controller:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

exports.reply = async (req, res) => {
    try {
        const id = req.params.id;
        const { apiKey } = req.query;
        const answer = req.body.answer;

        if (!id || !apiKey || !answer) {
            return res.status(400).json({ message: "Missing 'id or apikey' in query parameters." });
        }

        const response = await questionService.replyQuestion(apiKey, id, answer)

        if (response === 200) {
            res.json({ message: 'replyed succcessfully' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    } catch (error) {
        console.error('Error in get questions controller:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

