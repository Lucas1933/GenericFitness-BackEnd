import mongoose from "mongoose";
const collection = "Carts";
const schema = new mongoose.Schema(
  {
    products: [
      {
        _id: false,
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const cartModel = mongoose.model(collection, schema);
export default cartModel;
