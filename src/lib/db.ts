import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/plant_health_solutions";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  // If deployed in production (e.g. Vercel) and MONGODB_URI is not provided or points to localhost
  if (
    process.env.NODE_ENV === "production" &&
    (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes("127.0.0.1") || process.env.MONGODB_URI.includes("localhost"))
  ) {
    throw new Error("MONGODB_URI is not configured for production environment. Using in-memory fallback store.");
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      dbName: "plant_health_solutions",
      serverSelectionTimeoutMS: 3000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("Connected to MongoDB (plant_health_solutions)");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.warn("MongoDB connection not established; falling back to in-memory store:", (e as Error).message);
    throw e;
  }

  return cached.conn;
}

