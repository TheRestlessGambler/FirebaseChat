const admin = require('firebase-admin');
const db = admin.firestore();
const logger = require('../config/logger');

const sendMessageToDB = async (messageDetails) => {
  const {
    senderUid,
    receiverUid,
    messageText,
    from_avatar,
    from_name,
    to_avatar,
    to_name,
  } = messageDetails;

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

  return messageData;
};

module.exports = {
  sendMessageToDB,
};
