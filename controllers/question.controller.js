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