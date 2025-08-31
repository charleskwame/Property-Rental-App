import PropertyOwnerModel from "../models/propertyowner.models.js";
import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";

const authenticatePropertyOwner = async (request, response, next) => {
	try {
		let token;
		if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
			token = request.headers.authorization.split(" ")[1];
		}
		if (!token) {
			return response.status(401).json({ status: false, message: "No token found" });
		}
		const decodedToken = jwt.verify(token, JWT_SECRET);

		const confirmedOwner = await PropertyOwnerModel.findById(decodedToken.userID);

		if (!confirmedOwner) {
			return response.status(401).json({ status: false, message: "User not found" });
		}

		request.user = confirmedOwner;
		next();
	} catch (error) {
		response.status(401).json({
			status: false,
			message: "Unauthorized Access",
			error: error.message,
		});
		next(error);
	}
};

export default authenticatePropertyOwner;
