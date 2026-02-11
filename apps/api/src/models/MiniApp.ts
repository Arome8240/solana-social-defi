import mongoose, { Schema, Document } from "mongoose";

export interface IMiniApp extends Document {
  name: string;
  creatorId: mongoose.Types.ObjectId;
  embedUrl?: string;
  codeSnippet?: string;
  active: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MiniAppSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    embedUrl: String,
    codeSnippet: String,
    active: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IMiniApp>("MiniApp", MiniAppSchema);
