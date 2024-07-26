const express = require('express');
const admin = require('firebase-admin');
const { signupSchema } = require('../validators/user.validators');
const db = admin.firestore();
const logger = require('../config/logger');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { error, value } = signupSchema.validate(req.body);

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    logger.error(errorMessage);
    return res.status(400).json({
      status: 'error',
      message: errorMessage,
    });
  }

  const { email, password } = value;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: false,
      disabled: false,
    });

    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      createdAt: new Date().toISOString(),
    };

    await db.collection('users').add(userData);

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: userRecord,
    });
  } catch (error) { //Basic error handling
    let errorMessage = 'Error creating user';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'The email address is already in use by another account.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'The email address is not valid.';
    } else if (error.code === 'auth/invalid-password') {
      errorMessage = 'The password is not valid. It must be a string with at least six characters.';
    }

    logger.error(`${errorMessage}: ${error.message}`);

    res.status(500).json({
      status: 'error',
      message: errorMessage,
      data: error,
    });
  }
});

module.exports = router;
