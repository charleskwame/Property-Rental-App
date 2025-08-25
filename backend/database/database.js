import mongoose from "mongoose";

import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
	throw new Error("Database URI not found in config file");
}

const connectToDatabase = async () => {
	try {
		await mongoose.connect(DB_URI);
		console.log(`Database connected successfully in ${NODE_ENV}`);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

export default connectToDatabase;
