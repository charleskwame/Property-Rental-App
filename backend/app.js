import express from "express";
import { PORT } from "./config/env.js";
import RenterRouter from "./routes/renter.routes.js";
import connectToDatabase from "./database/database.js";

const app = express();

app.use("/api/v1/user/", RenterRouter);

app.listen(PORT, async () => {
	console.log(`running on port ${PORT}`);
	await connectToDatabase();
});

export default app;
