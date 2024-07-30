const admin = require('firebase-admin');
const db = admin.firestore();

const fetchMessagesForConversation = async (conversationId) => {
  const messages = [];
  
  const messageListRef = db.collection('messages').doc(conversationId).collection('messageList');
  
  const snapshot = await messageListRef.orderBy('addTime').get();

  if (snapshot.empty) {
    return [];
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    messages.push({
      content: data.content,
      uid: data.uid,
      time: data.addTime,
    });
  });

  return messages;
};

module.exports = {
  fetchMessagesForConversation,
};
