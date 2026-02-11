import mongoose, { Schema, Document } from "mongoose";

export interface ITrade extends Document {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  tokenMint: string;
  amount: number;
  status: "pending" | "completed" | "cancelled";
  txSignature?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TradeSchema: Schema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenMint: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    txSignature: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITrade>("Trade", TradeSchema);
