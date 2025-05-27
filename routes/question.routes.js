const express = require('express');
const router = express.Router();
const controller = require('../controllers/question.controller');

router.get('/', controller.getQuestions);
router.get('/id/:id', controller.getQuestionById);
router.get('/count-unanswered', controller.getCountUnanswered);
router.post('/process/:id', controller.processOne);
router.get('/recommend/:id', controller.recommend);
router.post('/reply/:id', controller.reply);

module.exports = router