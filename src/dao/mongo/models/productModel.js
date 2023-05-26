import mongoose from "mongoose";

const collection = "Product";
const schema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    status: Boolean,
    thumbnail: Array,
    code: String,
    stock: Number,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const productModel = mongoose.model(collection, schema);
export default productModel;
