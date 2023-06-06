import userModel from "../models/userModel.js";

export default class UserManager {
  createUser(user) {
    return userModel.create(user);
  }

  getUser(email) {
    return userModel.findOne({ email }).lean();
  }
  async checkIfUserExists(email) {
    const result = await userModel.findOne({ email }).lean();
    return result ? true : false;
  }
}
