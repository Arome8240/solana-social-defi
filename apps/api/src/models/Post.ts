import mongoose, { Schema, Document } from "mongoose";

interface ILike {
  user: mongoose.Types.ObjectId;
  timestamp: Date;
}

interface IComment {
  _id?: mongoose.Types.ObjectId;
  text: string;
  author: mongoose.Types.ObjectId;
  likes: ILike[];
  replies: IComment[];
  createdAt: Date;
}

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  media: string[];
  tokenized: boolean;
  tokenMintAddress?: string;
  likes: ILike[];
  comments: mongoose.Types.DocumentArray<
    IComment & { _id: mongoose.Types.ObjectId }
  >;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const LikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const CommentSchema: Schema = new Schema({
  text: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [LikeSchema],
  replies: [
    {
      type: Schema.Types.Mixed,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CommentSchema.add({ replies: [CommentSchema] });

const PostSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    media: [
      {
        type: String,
      },
    ],
    tokenized: {
      type: Boolean,
      default: false,
    },
    tokenMintAddress: {
      type: String,
      sparse: true,
    },
    likes: [LikeSchema],
    comments: [CommentSchema],
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ tokenized: 1 });

export default mongoose.model<IPost>("Post", PostSchema);
