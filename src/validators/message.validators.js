const Joi = require('joi');

const messageSchema = Joi.object({
  senderUid: Joi.string().required(),
  receiverUid: Joi.string().required(),
  messageText: Joi.string().required(),
  from_avatar: Joi.string().required(),
  from_name: Joi.string().required(),
  to_avatar: Joi.string().required(),
  to_name: Joi.string().required(),
});

module.exports = {
  messageSchema,
};
