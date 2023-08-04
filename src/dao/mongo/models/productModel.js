import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
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

schema.plugin(mongoosePaginate);

const productModel = mongoose.model(collection, schema);
productModel.isIdValid = async function (id) {
  return mongoose.Types.ObjectId.isValid(id);
};
export default productModel;
