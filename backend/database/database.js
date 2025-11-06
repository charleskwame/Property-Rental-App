import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV } from "../config/env.js";

if (!MONGODB_URI) {
	throw new Error("Database URI not found in config file");
}

const connectToDatabase = async () => {
	// If we're already connected, return the existing connection
	if (mongoose.connection.readyState === 1) {
		console.log("Using existing database connection");
		return mongoose.connection;
	}

	try {
		const opts = {
			maxPoolSize: 10,
			serverSelectionTimeoutMS: 5000,
			socketTimeoutMS: 45000,
		};

		await mongoose.connect(MONGODB_URI, opts);
		console.log(`Database connected successfully in ${NODE_ENV}`);

		return mongoose.connection;
	} catch (error) {
		console.error("Database connection error:", error);
		console.log("Error occurred in connect to database function");
		process.exit(1);
	}
};

export default connectToDatabase;
