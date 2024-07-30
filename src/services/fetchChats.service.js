const admin = require('firebase-admin');
const db = admin.firestore();

const fetchConversationsForUser = async (userUid) => {
  try {
    const conversations = [];
    const snapshot = await db.collection('messages').where('users', 'array-contains', userUid).get();

    if (snapshot.empty) {
      return []; 
    }

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const conversationId = doc.id;
      const otherUserUid = data.users.find(uid => uid !== userUid);
      const otherUserName = userUid === data.from_uid ? data.to_name : data.from_name;
      const otherUserAvatar = userUid === data.from_uid ? data.to_avatar : data.from_avatar;
      const messageNum = data.message_num;
      const lastMessage = data.last_message;
      const lastTime = data.last_time;

      conversations.push({
        name: otherUserName,  
        uid: otherUserUid,
        avatar: otherUserAvatar,
        conversationID: conversationId,
        lastMessage,
        lastTime,
        messageNum
      });
    }

    return conversations;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw new Error('Error fetching conversations');
  }
};

module.exports = {
  fetchConversationsForUser,
};
