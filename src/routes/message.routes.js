const express = require('express');
const admin = require('firebase-admin');
const db = admin.firestore();
const logger = require('../config/logger');
const router = express.Router();

router.post('/message', async (req, res) => {
  const { 
    senderUid, 
    receiverUid, 
    messageText, 
    from_avatar, 
    from_name, 
    to_avatar, 
    to_name 
  } = req.body;

 // Check if all the required fields are present as i have not added any validations yet

  if (!senderUid || !receiverUid || !messageText || !from_avatar || !from_name || !to_avatar || !to_name) {
    const errorMessage = 'senderUid, receiverUid, messageText, from_avatar, from_name, to_avatar, and to_name are required';
    logger.error(errorMessage);
    return res.status(400).json({
      status: 'error',
      message: errorMessage,
    });
  }
 // Document name is the conversation id ( in the messages collection )
  try {
    const conversationId = [senderUid, receiverUid].sort().join('_');

    // messageData is stored in the messageList sub collection

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

 // Sub collection messageList is used to store the messages

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
