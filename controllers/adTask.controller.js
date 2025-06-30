const adTaskService = require('../services/adTask.service');

exports.createAdTask = async (req, res) => {
    try {
        const { shopId, adId, budget, startTime, startDate, endDate } = req.body;

        if (!shopId || !adId || !startTime || !startDate || !endDate) {
            return res.status(400).json({ error: "Invalid payload"});
        }

        const adTask = await adTaskService.createAdTask(
            shopId, adId, budget, 
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}