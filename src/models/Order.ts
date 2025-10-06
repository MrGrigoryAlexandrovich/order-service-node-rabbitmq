import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  title: string;
  customerName: string;
  customerEmail: string;
}

const OrderSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
