import mongoose from "mongoose";
const collection = "User";
const schema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    password: String,
    cart: mongoose.Schema.Types.ObjectId,
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const userModel = mongoose.model(collection, schema);
userModel.isIdValid = async function (id) {
  return mongoose.Types.ObjectId.isValid(id);
};
export default userModel;
