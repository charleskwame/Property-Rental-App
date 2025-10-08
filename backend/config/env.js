import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
	PORT,
	NODE_ENV,
	MONGODB_URI,
	JWT_SECRET,
	JWT_EXPIRES_IN,
	NODEMAILER_EMAIL,
	NODEMAILER_PASSWORD,
	SENDGRIDKEY,
} = process.env;
