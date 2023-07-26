import mongoose from "mongoose";
import crypto from "crypto";
const collection = "Ticket";
const schema = new mongoose.Schema(
  {
    code: String,
    purchase_datetime: {
      type: Date,
      default: Date.now,
    },
    amount: Number,
    purchaser: String,
  },
  {
    versionKey: false,
  }
);
schema.pre("save", function (next) {
  if (!this.code) {
    this.code = crypto.randomBytes(3).toString("hex").toUpperCase();
  }
  next();
});
const ticketModel = mongoose.model(collection, schema);

export default ticketModel;
