const express = require('express');
const authenticate = require('../middlewares/authenticator');
const { sendMessage } = require('../controllers/message.controller');
const router = express.Router();

router.post('/message', authenticate, sendMessage);

module.exports = router;
