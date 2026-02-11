import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  walletAddress: string;
  encryptedPrivateKey: string;
  username: string;
  email: string;
  passwordHash: string;
  biometricEnabled: boolean;
  role: "user" | "creator" | "admin";
  balances: {
    skr: number;
    sol: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    encryptedPrivateKey: {
      type: String,
      required: true,
      select: false, // Don't return by default for security
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    biometricEnabled: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "creator", "admin"],
      default: "user",
    },
    balances: {
      skr: {
        type: Number,
        default: 0,
      },
      sol: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ email: 1 });
UserSchema.index({ walletAddress: 1 });

export default mongoose.model<IUser>("User", UserSchema);
