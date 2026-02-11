import mongoose, { Schema, Document } from "mongoose";

export interface IToken extends Document {
  mintAddress: string;
  ownerId: mongoose.Types.ObjectId;
  metadata: {
    name: string;
    symbol?: string;
    uri?: string;
    description?: string;
    image?: string;
  };
  type: "token" | "nft";
  supply?: number;
  decimals?: number;
  createdAt: Date;
  updatedAt: Date;
}

const TokenSchema: Schema = new Schema(
  {
    mintAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    metadata: {
      name: {
        type: String,
        required: true,
      },
      symbol: String,
      uri: String,
      description: String,
      image: String,
    },
    type: {
      type: String,
      enum: ["token", "nft"],
      required: true,
    },
    supply: Number,
    decimals: {
      type: Number,
      default: 9,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IToken>("Token", TokenSchema);
