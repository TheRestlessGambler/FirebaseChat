const { fetchMessagesForConversation } = require('../services/conversation.service');
const logger = require('../config/logger');

const getMessages = async (req, res) => {
  const conversationId = req.query.conversationId; 

  if (!conversationId) {
    return res.status(400).json({
      status: 'error',
      message: 'Conversation ID is required',
    });
  }

  try {
    const messages = await fetchMessagesForConversation(conversationId);

    res.status(200).json({
      status: 'success',
      data: messages,
    });
  } catch (error) {
    const errorMessage = 'Error fetching messages';
    logger.error(`${errorMessage}: ${error.message}`);

    res.status(500).json({
      status: 'error',
      message: errorMessage,
      data: error.message,
    });
  }
};

module.exports = {
  getMessages,
};
