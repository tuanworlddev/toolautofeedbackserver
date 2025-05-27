const express = require('express');
const router = express.Router();
const controller = require('../controllers/question.controller');

router.get('/count-unanswered', controller.getCountUnanswered);
router.post('/process/:id', controller.processOne);

module.exports = router