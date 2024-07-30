const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const credentials = require('./serviceAccountKey.json');
const logger = require('./src/config/logger');

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


const authRoutes = require('./src/routes/auth.routes');
const fetchChatsRoutes = require('./src/routes/fetchChats.routes');
const messageRoutes = require('./src/routes/message.routes');
const conversationRoutes = require('./src/routes/conversation.routes');


app.use('/api/auth', authRoutes);
app.use('/api/chats', fetchChatsRoutes);
app.use('/api', messageRoutes);
app.use('/api', conversationRoutes);


const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
