import userModel from "../../dao/mongo/models/user_model.js";

export default class UserRepository {
  async createUser(user) {
    const createdUser = await userModel.create(user);
    return createdUser;
  }

  async getUserByEmail(email) {
    return await userModel.findOne({ email }).lean();
  }
  async getUserById(id) {
    return await userModel.findById(id);
  }

  async updateUserPassword(email, user) {
    return await userModel.updateOne({ email }, { password: user.password });
  }
  async updateUserRole(id, role) {
    return await userModel.updateOne({ _id: id }, { role: role });
  }
  async isIdValid(id) {
    return await userModel.isIdValid(id);
  }
}
