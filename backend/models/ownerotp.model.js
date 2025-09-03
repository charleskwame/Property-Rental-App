import mongoose from "mongoose";

const OwnerOTPSchema = mongoose.Schema({
	userID: String,
	otp: String,
	createdAt: Date,
	expiresIn: Date,
});

const OwnerOTPModel = mongoose.model("RenterOTPModel", OwnerOTPSchema, "otpverifications");

export default OwnerOTPModel;
