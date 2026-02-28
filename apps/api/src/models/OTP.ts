import mongoose, { Schema, Document } from "mongoose";

export interface IOTP extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
  createdAt: Date;
}

const OTPSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Auto-delete expired OTPs after 15 minutes
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOTP>("OTP", OTPSchema);
