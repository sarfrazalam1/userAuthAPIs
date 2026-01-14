import "dotenv/config";
import { connectDB } from "./src/config/db.js";
import { app } from "./src/app.js";

const port = process.env.PORT || 4000;
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(
        `🚀 Server running in ${process.env.NODE_ENV || "development"} mode`
      );
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error(" Database connection failed: ", err);
    process.exit(1);
  });
