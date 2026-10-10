import { Schema, model, type Document, Types } from "mongoose";

export interface IChat extends Document {
  userId: Types.ObjectId;
  title: string;
  lastMessagePreview: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      default: "New Chat",
    },
    lastMessagePreview: {
      type: String,
      default: "",
      maxlength: 200,
    },
  },
  { timestamps: true },
);

chatSchema.index({ userId: 1, updatedAt: -1 });

export const Chat = model<IChat>("Chat", chatSchema);
