import mongoose from "mongoose";
import "dotenv/config";
import { User } from "../src/models/user.model.js";

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Connected to Database Successfully");

    const result = await User.deleteOne({ email: process.env.ADMIN_EMAIL });

    if (result.deletedCount > 0) {
      console.log("🗑️ Admin deleted successfully.");
    } else {
      console.log("ℹ️ No admin found to delete.");
    }
  } catch (error) {
    console.error("❌ Error during reset:", error.message);

    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 Database connection closed.");
  }
};

resetAdmin();
