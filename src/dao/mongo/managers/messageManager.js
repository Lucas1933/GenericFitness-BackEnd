import messageModel from "../models/messageModel.js";

export default class MessagesManager {
  getMessages(params) {
    return messageModel.find(params).lean();
  }

  createMessage(message) {
    return messageModel.create(message);
  }
}
