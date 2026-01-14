import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connnectionIntance = await mongoose.connect(process.env.DB_URL);
    console.log(
      `mongoDB connected Successfully on DB HOST: ${connnectionIntance.connection.host}`
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
