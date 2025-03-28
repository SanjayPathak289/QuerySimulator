const express = require('express');
const queryController = require('../controllers/queryController');

const router = express.Router();

// Query endpoints
router.post('/query', queryController.processQuery);
router.post('/explain', queryController.explainQuery);
router.post('/validate', queryController.validateQuery);

module.exports = router;