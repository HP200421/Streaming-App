// require("dotenv").config();
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

connectDB();

// This code also works but it pollutes the index file
// const express = require("express");
// const app = express();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("Error occor while connecting to database", error);
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`App listening on ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log("Error: ", error);
//     throw error;
//   }
// })();
