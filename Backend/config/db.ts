import mongoose from "mongoose";
// חיבור למסד הנתונים לפי שדות ב env
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("❌ MONGO_URI is not defined in environment variables.");
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB Atlas");
    
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
    // במידה ולא הצליח להתחבר אז סוגר את האתר
    
  }
}

export default connectDB;
