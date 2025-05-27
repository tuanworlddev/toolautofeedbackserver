const express = require('express');
const controller = require('../controllers/feedback.controller');

const router = express.Router();

router.get('/', controller.getFeedbacks);
router.get('/count-unanswered', controller.countUnanswered);
router.post('/process/:id', controller.processOne);

module.exports = router;