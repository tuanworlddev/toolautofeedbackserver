const AdTask = require('../models/adTask.model');

const createAdTask = async (shopId, adId, budget, startTime, startDate, endDate) => {
  const newAdTask = new AdTask({
    shopId,
    adId,
    budget,
    startTime,
    startDate,
    endDate
  });

  const savedTask = await newAdTask.save();

  return {
    id: savedTask._id.toString(),
    shopId,
    adId,
    budget,
    startTime,
    startDate,
    endDate
  };
};

module.exports = { createAdTask };