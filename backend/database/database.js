import mongoose from "mongoose";

import { MONGODB_URI, NODE_ENV } from "../config/env.js";

if (!MONGODB_URI) {
	throw new Error("Database URI not found in config file");
}

const connectToDatabase = async () => {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log(`Database connected successfully in ${NODE_ENV}`);
	} catch (error) {
		console.log(error);
		console.log("Error occured in connect to database function");
		process.exit(1);
	}
};

export default connectToDatabase;
