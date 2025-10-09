import express from "express";
import { PORT } from "./config/env.js";

import connectToDatabase from "./database/database.js";

import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./routes/user.routes.js";

const app = express();

// Allow requests from specific origin (e.g., frontend at port 3000)
app.use(
	cors({
		origin: "*", // or "*" to allow all
		credentials: true, // if you're using cookies or auth headers
	}),
);

app.use(errorMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/user/", UserRouter);

app.listen(PORT || 5050, async () => {
	console.log(`running on port ${PORT}`);
	await connectToDatabase();
});

export default app;
