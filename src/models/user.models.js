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
    fullName: {
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

userSchema.pre("save", async function (next) {
  // We have to check if password is modified or not
  // then only it will get encrypted
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  // It takes two arguments plain text and encrypted text
  return await bcrypt.compare(password, this.password);
};

// Stateless
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      // expires in is always in object
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
// Statefull
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
