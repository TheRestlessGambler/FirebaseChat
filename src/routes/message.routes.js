const express = require('express');
const admin = require('firebase-admin');
const { messageSchema } = require('../validators/message.validators');
const db = admin.firestore();
const logger = require('../config/logger');
const authenticate = require('../middlewares/authenticator');
const router = express.Router();

router.post('/message', authenticate, async (req, res) => {
  const { error, value } = messageSchema.validate(req.body);

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    logger.error(errorMessage);
    return res.status(400).json({
      status: 'error',
      message: errorMessage,
    });
  }

  const {
    senderUid,
    receiverUid,
    messageText,
    from_avatar,
    from_name,
    to_avatar,
    to_name,
  } = value;

  try {
    const conversationId = [senderUid, receiverUid].sort().join('_');

    const messageData = {
      addTime: new Date().toISOString(),
      content: messageText,
      type: 'text',
      uid: senderUid,
    };

    const conversationRef = db.collection('messages').doc(conversationId);
    const conversationDoc = await conversationRef.get();

    const lastMessageData = {
      from_avatar,
      from_name,
      from_uid: senderUid,
      last_message: messageText,
      last_time: new Date().toISOString(),
      message_num: admin.firestore.FieldValue.increment(1),
      to_avatar,
      to_name,
      to_uid: receiverUid,
    };

    if (conversationDoc.exists) {
      await conversationRef.update(lastMessageData);
    } else {
      await conversationRef.set({
        ...lastMessageData,
        users: [senderUid, receiverUid],
      });
    }

    const messageListRef = conversationRef.collection('messageList').doc();
    await messageListRef.set(messageData);

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
});

module.exports = router;
