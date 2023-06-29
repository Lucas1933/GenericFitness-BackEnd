import mongoose from "mongoose";
const collection = "User";
const schema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
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
export default userModel;
