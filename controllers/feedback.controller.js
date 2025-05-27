const ShopService = require('../services/shop.service');
const feedbackService = require('../services/feedback.service');

exports.processOne = async (req, res) => {
    try {
        const shop = await ShopService.getById(req.params.id);
        if (!shop) return res.status(404).json({ message: 'Shop not found' });
        await feedbackService.handleShopFeedbacks(shop);
        res.json({ message: 'Process successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.countUnanswered = async (req, res) => {
    try {
        const apiKey = req.query.apiKey;
        if (!apiKey) {
            return res.status(400).json({ message: "Missing 'apikey' in query parameters." });
        }
        const count = await feedbackService.getCountUnanswered(apiKey);
        console.log('Get count feedbacks unanswered:', count.countUnanswered);
        res.json(count);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getFeedbacks = async (req, res) => {
    try {
        const { apiKey, isAnswered, take = 20, skip = 0, order = 'dateDesc' } = req.query;

        if (!apiKey) {
            return res.status(400).json({ message: "Missing 'apikey' in query parameters." });
        }

        const feedbacks = await feedbackService.getFeedbacks(
            apiKey,
            isAnswered,
            parseInt(take),
            parseInt(skip),
            order
        );

        res.json({ feedbacks });
    } catch (error) {
        console.error('Error in getFeedbacks controller:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

