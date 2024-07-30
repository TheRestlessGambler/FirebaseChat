const { fetchConversationsForUser } = require('../services/fetchChats.service');
const logger = require('../config/logger');

const getConversations = async (req, res) => {
  const userUid = req.query.userUid; // Get userUid from query parameters

  if (!userUid) {
    return res.status(400).json({
      status: 'error',
      message: 'User UID is required',
    });
  }

  try {
    const conversations = await fetchConversationsForUser(userUid);

    res.status(200).json({
      status: 'success',
      data: conversations,
    });
  } catch (error) {
    const errorMessage = 'Error fetching conversations';
    logger.error(`${errorMessage}: ${error.message}`);

    res.status(500).json({
      status: 'error',
      message: errorMessage,
      data: error.message,
    });
  }
};

module.exports = {
  getConversations,
};
