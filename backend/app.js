import express from "express";
import { PORT } from "./config/env.js";
//import RenterRouter from "./routes/renter.routes.js";
import connectToDatabase from "./database/database.js";
//import PropertyOwnerRouter from "./routes/user.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./routes/user.routes.js";
//import authenticateRenter from "./middleware/authenticaterenters.middleware.js";
//import authenticatePropertyOwner from "./middleware/authenticatepropertyowners.middleware.js";

const app = express();
//const appcors = cors();

// Allow requests from specific origin (e.g., frontend at port 3000)
// app.use(
// 	cors({
// 		origin: "*", // or "*" to allow all
// 		credentials: true, // if you're using cookies or auth headers
// 	}),
// );

app.use(errorMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use("/api/v1/renters/", RenterRouter);
app.use("/api/v1/user/", UserRouter);

app.listen(PORT || 5050, async () => {
	console.log(`running on port ${PORT}`);
	await connectToDatabase();
});

export default app;
