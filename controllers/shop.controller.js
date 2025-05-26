const shopService = require('../services/shop.service');

exports.getAll = async (req, res) => {
    try {
        const shops = await shopService.getAll();
        console.log('Get all shops:', shops);
        res.json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getById = async (req, res) => {
    try {
        const shop = await shopService.getById(req.params.id);
        if (!shop) return res.status(404).json({ message: 'Shop not found' });
        res.json(shop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.create = async (req, res) => {
    try {
        const { name, apiKey } = req.body;
        if (!name || !apiKey) return res.status(400).json({ message: 'Invalid data'});
        const newShop = await shopService.create({ name, apiKey });
        console.log('Created shop:', newShop.name);
        res.status(201).json(newShop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.update = async (req, res) => {
    try {
        const updated = await shopService.update(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Shop not found' });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.remove = async (req, res) => {
    try {
        const removed = await shopService.remove(req.params.id);
        if (!removed) return res.status(404).json({ message: 'Shop not found'});
        res.json({ message: 'Shop deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.toggleActivate = async (req, res) => {
    try {
        const shop = await shopService.toggleActivate(req.params.id);
        if (!shop) return res.status(404).json({ message: 'Shop not found' });
        console.log('Toogle activate:', shop.name);
        res.json(shop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.toggleIsAuto = async (req, res) => {
    try {
        const shop = await shopService.toggleIsAuto(req.params.id);
        if (!shop) return res.status(404).json({ message: 'Shop not found' });
        res.json(shop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}