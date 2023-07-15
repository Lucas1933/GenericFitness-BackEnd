import userModel from "../../dao/mongo/models/userModel.js";

export default class UserRepository {
  async createUser(user) {
    const createdUser = await userModel.create(user);
    return createdUser;
  }

  async getUser(email) {
    return await userModel.findOne({ email }).lean();
  }
}
