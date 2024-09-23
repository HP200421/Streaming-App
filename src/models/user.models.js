import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url will go in here
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      // array of videoes id
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      // password must be encrypted while storing in database
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
