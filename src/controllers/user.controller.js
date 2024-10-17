import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadCloudinary } from "../utils/cloudinary.js";

export const registerUser = asyncHandler(async (req, res) => {
  // Steps to follow
  // 1. Get user details from frontend
  // 2. Validation at backend side => Required, Check email, Not empty
  // 3. Check if user already exit in the database => By means by email, username
  // 4. Check for required images or avatars
  // 5. Upload them to cloudinary
  // 6. Create user object => Create entry in database
  // 7. Remove password and usertoken field from response
  // 8. Check for user creattion
  // 9. Return response

  const { username, fullName, email, password } = req.body;
  console.log("Username: ", username);

  // We have to do this for all fields
  // if (fullName === "") {
  //   throw new ApiError(400, "Fullname is required");
  // }

  if (
    [username, fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Server takes time so it is good practice to use await before time consuming operations
  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = await uploadCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    username,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", // not required field
    email,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});
