import mongoose from "mongoose";

const OwnerOTPSchema = mongoose.Schema({
	userID: String,
	otp: String,
	createdAt: Date,
	expiresIn: Date,
});

const OwnerOTPModel = mongoose.model("OwnerOTPModel", OwnerOTPSchema, "otpverifications");

export default OwnerOTPModel;
