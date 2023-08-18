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
    owner: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

schema.plugin(mongoosePaginate);

const productModel = mongoose.model(collection, schema);
productModel.isIdValid = async function (id) {
  return mongoose.Types.ObjectId.isValid(id);
};
productModel.equals = async function (id1, id2) {
  return (
    id1 instanceof mongoose.Types.ObjectId &&
    id2 instanceof mongoose.Types.ObjectId &&
    id1.equals(id2)
  );
};
export default productModel;
