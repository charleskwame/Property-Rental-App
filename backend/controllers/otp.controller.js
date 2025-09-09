/* eslint-disable no-unused-vars */
//import RenterOTPModel from "../models/otp.model.js";
import bcrypt from "bcryptjs";
//import RenterModel from "../models/Renter.models.js";
//import OwnerOTPModel from "../models/otp.model.js";
//import PropertyModel from "../models/property.model.js";
//import PropertyOwnerModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import UserModel from "../models/user.model.js";
import OTPModel from "../models/otp.model.js";

export const verifyOTP = async (request, response) => {
	try {
		const { userID, otp } = request.body;
		if (!userID || !otp) {
			return response.status(400).json({ status: "Failed", message: "Empty ID or OTP" });
		}
		const findingOTP = await OTPModel.findOne({ userID: userID });

		//return response.json({ findingOTP });

		if (findingOTP.length <= 0) {
			return response
				.status(400)
				.json({ status: "Failed", message: "Account Not Fount/Already Verified" });
		}

		const { expiresIn } = findingOTP;

		const hashedOTP = findingOTP.otp;
		//return response.json({ otp });

		if (expiresIn < Date.now()) {
			await OTPModel.deleteMany({ userID: userID });
			return response.status(400).json({ status: "Failed", message: "Code Expired" });
		}

		const verifiedOTP = await bcrypt.compare(otp, hashedOTP);

		//return response.json({ verifiedOTP });

		if (!verifiedOTP) {
			return response.status(400).json({ status: "Failed", message: "Invalid OTP" });
		}

		await UserModel.updateOne({ _id: userID }, { isVerified: true });
		await OTPModel.deleteMany({ userID: userID });

		//const updatedRenterModel = await RenterModel.findById(userID);
		const updatedUser = await UserModel.findById(userID);

		const token = jwt.sign({ userID: updatedUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

		const { password: _, ...userWithoutPassword } = updatedUser.toObject();

		response.status(200).json({
			status: "Success",
			message: "Successfully Verified",
			data: { token, userWithoutPassword },
		});
	} catch (error) {
		response.status(404).json({ status: "Failed", message: error.message });
	}
};
