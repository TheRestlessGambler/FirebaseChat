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

// Import the routes
const authRoutes = require('./src/routes/auth.routes');
const messageRoutes = require('./src/routes/message.routes');

// Use the routes
app.use('/api', authRoutes);
app.use('/api', messageRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
