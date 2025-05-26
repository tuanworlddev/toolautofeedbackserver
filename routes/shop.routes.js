const express = require('express');
const router = express.Router();
const controller = require('../controllers/shop.controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/activate/:id', controller.toggleActivate);
router.patch('/isauto/:id', controller.toggleIsAuto);
router.delete('/:id', controller.remove);

module.exports = router;