const express = require('express');
const router = express.Router();
const { getConversations } = require('../controllers/fetchChats.controller');

router.get('/fetch-chats', getConversations);

module.exports = router;
