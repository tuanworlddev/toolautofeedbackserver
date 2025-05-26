const Shop = require('../models/shop.model');

const getAll = async () => {
    const shops = await Shop.find();
    if (!shops) return [];
    return shops.map((shop) => ({
        id: shop._id.toString(),
        name: shop.name,
        apiKey: shop.apiKey,
        activate: shop.activate,
        isAuto: shop.isAuto,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt,
    }));
};

const getById = async (id) => {
    const shop = await Shop.findById(id);
    if (!shop) return null;
    return ({
        id: shop._id.toString(),
        name: shop.name,
        apiKey: shop.apiKey,
        activate: shop.activate,
        isAuto: shop.isAuto,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt,
    });
};

const create = async (data) => {
    const newShop = new Shop(data);
    const shop = await newShop.save();
    return ({
        id: shop._id.toString(),
        name: shop.name,
        apiKey: shop.apiKey,
        activate: shop.activate,
        isAuto: shop.isAuto,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt,
    });
};

const update = async (id, data) => {
    data.updatedAt = new Date();
    const shop = await Shop.findByIdAndUpdate(id, data, { new: true });
    if (!shop) return null;
    return ({
        id: shop._id.toString(),
        name: shop.name,
        apiKey: shop.apiKey,
        activate: shop.activate,
        isAuto: shop.isAuto,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt,
    });
};

const remove = async (id) => {
    return await Shop.findByIdAndDelete(id);
};

const toggleActivate = async (id) => {
    const shop = await Shop.findById(id);
    if (!shop) return null;
    shop.activate = !shop.activate;
    shop.updatedAt = new Date();
    await shop.save();
    return {
        id: shop._id.toString(),
        name: shop.name,
        apiKey: shop.apiKey,
        activate: shop.activate,
        isAuto: shop.isAuto,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt,
    }
}

const toggleIsAuto = async (id) => {
    const shop = await Shop.findById(id);
    if (!shop) return null;
    shop.isAuto = !shop.isAuto;
    shop.updatedAt = new Date();
    await shop.save();
    return {
        id: shop._id.toString(),
        name: shop.name,
        apiKey: shop.apiKey,
        activate: shop.activate,
        isAuto: shop.isAuto,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt,
    }
}

module.exports = { getAll, getById, create, update, remove, toggleActivate, toggleIsAuto };