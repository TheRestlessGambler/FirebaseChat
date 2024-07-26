const admin = require('firebase-admin');
const logger = require('../config/logger');

const authenticate = async (req, res, next) => {
  const { senderUid, receiverUid } = req.body;

  try {
    const senderRecord = await admin.auth().getUser(senderUid);
    const receiverRecord = await admin.auth().getUser(receiverUid);

    if (!senderRecord || !receiverRecord) {
      const errorMessage = 'Sender or Receiver UID not found in Firebase Auth';
      logger.error(errorMessage);
      return res.status(404).json({
        status: 'error',
        message: errorMessage,
      });
    }

    next();
  } catch (error) {
    const errorMessage = 'Error verifying UIDs in Firebase Auth';
    logger.error(`${errorMessage}: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: errorMessage,
      data: error.message,
    });
  }
};

module.exports = authenticate;
