import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import RenterModel from "../models/Renter.models.js";

const authenticateRenter = async (request, response, next) => {
	try {
		let token;
		if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
			token = request.headers.authorization.split(" ")[1];
		}
		if (!token) {
			return response.status(401).json({ status: false, message: "No token found" });
		}
		const decodedToken = jwt.verify(token, JWT_SECRET);

		const confirmedUser = await RenterModel.findById(decodedToken.userID);

		if (!confirmedUser) {
			return response.status(401).json({ status: false, message: "User not found" });
		}

		request.user = confirmedUser;
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

export default authenticateRenter;
