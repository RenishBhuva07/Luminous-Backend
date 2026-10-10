import { Schema, model, type Document, Types } from "mongoose";

export interface IPasswordReset extends Document {
  userId: Types.ObjectId;
  email: string;

  otpHash: string;
  otpExpiresAt: Date;

  attempts: number;

  resetTokenHash?: string;
  resetTokenExpiresAt?: Date;

  verifiedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    otpExpiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    resetTokenHash: {
      type: String,
    },

    resetTokenExpiresAt: {
      type: Date,
    },

    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

passwordResetSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordReset = model<IPasswordReset>(
  "PasswordReset",
  passwordResetSchema,
);
