import mongoose from "mongoose";

const OTPSchema = mongoose.Schema({
	userID: String,
	otp: String,
	createdAt: Date,
	expiresIn: Date,
});

const OTPModel = mongoose.model("OTPModel", OTPSchema, "otpverifications");

export default OTPModel;
