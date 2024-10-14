import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDNARY_CLOUD_SECRET,
});

const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file hase been uploaded successfully
    console.log("File is uploaded on cloudinary", response.url);

    return response;
  } catch (error) {
    // remove the locally saved temporary file as the upload operation got failed
    fs.unlinkSync(localFilePath); // must do it before moving ahead
    return null;
  }
};

export { uploadCloudinary };
