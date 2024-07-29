const { messageSchema } = require('../validators/message.validators');
const { sendMessageToDB } = require('../services/message.service');
const logger = require('../config/logger');

const sendMessage = async (req, res) => {
  const { error, value } = messageSchema.validate(req.body);

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    logger.error(errorMessage);
    return res.status(400).json({
      status: 'error',
      message: errorMessage,
    });
  }

  try {
    const messageData = await sendMessageToDB(value);

    res.status(201).json({
      status: 'success',
      message: 'Message sent successfully',
      data: messageData,
    });
  } catch (error) {
    const errorMessage = 'Error sending message';
    logger.error(`${errorMessage}: ${error.message}`);

    res.status(500).json({
      status: 'error',
      message: errorMessage,
      data: error.message,
    });
  }
};

module.exports = {
  sendMessage,
};
