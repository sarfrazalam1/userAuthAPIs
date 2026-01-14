import mongoose from "mongoose";
import "dotenv/config";
import { User } from "../src/models/user.model.js";

const { DB_URL, ADMIN_NAMES, ADMIN_EMAIL, ADMIN_PASS, ADMIN_USERNAME } =
  process.env;

const seedAdmin = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("mongoDB connected successfully");

    const existedAdmin = await User.findOne({
      $or: [{ email: ADMIN_EMAIL }, { username: ADMIN_USERNAME }],
    });
    if (existedAdmin) {
      console.log("Admin is already exists.");
      return process.exit(0);
    }

    const admin = await User.create({
      username: ADMIN_USERNAME,
      fullName: ADMIN_NAMES,
      email: ADMIN_EMAIL,
      password: ADMIN_PASS,
      role: "admin",
    });

    console.log("Admin created successfully:", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("Error while seeding admin:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
