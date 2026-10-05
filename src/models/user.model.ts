import { Schema, model, type Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;

  name?: string;
  avatarUrl?: string;

  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      select: false,
    },

    name: {
      type: String,
      trim: true,
    },

    avatarUrl: {
      type: String,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>("User", userSchema);
