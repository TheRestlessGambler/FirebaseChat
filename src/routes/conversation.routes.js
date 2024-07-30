const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/conversation.controller');


router.get('/conversation', getMessages);

module.exports = router;
