import express from "express";
import { PORT } from "./config/env.js";
import connectToDatabase from "./database/database.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./routes/user.routes.js";
import mongoose from "mongoose";

const app = express();

// CORS configuration
app.use(
	cors({
		origin: process.env.FRONTEND_URL || "*",
		credentials: true,
	}),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(cookieParser());

// Health check endpoint
app.get("/health", (req, res) => {
	res.status(200).json({
		status: "OK",
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV,
	});
});

// Database connection middleware
app.use(async (req, res, next) => {
	try {
		await connectToDatabase();
		next();
	} catch (error) {
		console.error("Database connection failed:", error);
		res.status(500).json({
			error: "Database connection failed",
			message: error.message,
		});
	}
});

app.use("/api/v1/user/", UserRouter);
app.use(errorMiddleware);

// Handle unhandled routes
app.use("*", (req, res) => {
	res.status(404).json({ error: "Route not found" });
});

const server = app.listen(PORT || 5050, async () => {
	console.log(`Server running on port ${PORT}`);
	try {
		await connectToDatabase();
		console.log("Database connected successfully");
	} catch (error) {
		console.error("Failed to connect to database on startup:", error);
	}
});

// Graceful shutdown
process.on("SIGTERM", () => {
	console.log("SIGTERM received, shutting down gracefully");
	server.close(() => {
		mongoose.connection.close();
		console.log("Process terminated");
	});
});

export default app;
