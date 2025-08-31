import express from "express";
import { PORT } from "./config/env.js";
import RenterRouter from "./routes/renter.routes.js";
import connectToDatabase from "./database/database.js";
import PropertyOwnerRouter from "./routes/propertyowner.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import authenticateRenter from "./middleware/authenticaterenters.middleware.js";
import authenticatePropertyOwner from "./middleware/authenticatepropertyowners.middleware.js";

const app = express();

app.use(errorMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/renters/", authenticateRenter, RenterRouter);
app.use("/api/v1/owners/", authenticatePropertyOwner, PropertyOwnerRouter);

app.listen(PORT, async () => {
	console.log(`running on port ${PORT}`);
	await connectToDatabase();
});

export default app;
