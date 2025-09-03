import RenterOTPModel from "../models/renterotp.model.js";
import bcrypt from "bcryptjs";
import RenterModel from "../models/Renter.models.js";
import OwnerOTPModel from "../models/renterotp.model.js";
//import PropertyModel from "../models/property.model.js";
import PropertyOwnerModel from "../models/propertyowner.models.js";

export const verifyRenterOTP = async (request, response, next) => {
	try {
		const { userID, otp } = request.body;
		if ((!userID, !otp)) {
			return response.status(400).json({ status: "Failed", message: "Empty ID or OTP" });
		}
		const findingOTP = await RenterOTPModel.findOne({ userID: userID });

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
			await RenterOTPModel.deleteMany({ userID: userID });
			return response.status(400).json({ status: "Failed", message: "Code Expired" });
		}

		const verifiedOTP = await bcrypt.compare(otp, hashedOTP);

		//return response.json({ verifiedOTP });

		if (!verifiedOTP) {
			return response.status(400).json({ status: "Failed", message: "Invalid OTP" });
		}

		await RenterModel.updateOne({ _id: userID }, { isVerified: true });
		await RenterOTPModel.deleteMany({ userID: userID });

		response.status(200).json({ status: "Success", message: "Successfully Verified" });

		next();
	} catch (error) {
		response.status(404).json({ status: "Failed", message: error.message });
		next();
	}
};

export const verifyOwnerOTP = async (request, response, next) => {
	try {
		const { userID, otp } = request.body;
		if ((!userID, !otp)) {
			return response.status(400).json({ status: "Failed", message: "Empty ID or OTP" });
		}
		const findingOTP = await OwnerOTPModel.findOne({ userID: userID });

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
			await OwnerOTPModel.deleteMany({ userID: userID });
			return response.status(400).json({ status: "Failed", message: "Code Expired" });
		}

		const verifiedOTP = await bcrypt.compare(otp, hashedOTP);

		//return response.json({ verifiedOTP });

		if (!verifiedOTP) {
			return response.status(400).json({ status: "Failed", message: "Invalid OTP" });
		}

		await PropertyOwnerModel.updateOne({ _id: userID }, { isVerified: true });
		await OwnerOTPModel.deleteMany({ userID: userID });

		response.status(200).json({ status: "Success", message: "Successfully Verified" });

		next();
	} catch (error) {
		response.status(404).json({ status: "Failed", message: error.message });
		next();
	}
};
