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
        const count = await feedbackService.getCountUnanswered(req.query.apikey);
        res.json(count);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
