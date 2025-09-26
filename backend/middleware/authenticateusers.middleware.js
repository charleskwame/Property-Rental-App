//import PropertyOwnerModel from "../models/propertyowner.models.js";
import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const authenticateUser = async (request, response, next) => {
	try {
		let token;
		if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
			token = request.headers.authorization.split(" ")[1];
		}
		//return response.json({ status: true, message: ` the token is ${token}` });
		if (!token) {
			return response.status(401).json({ status: false, message: "No token found" });
		}
		const decodedToken = jwt.verify(token, JWT_SECRET);

		const confirmedUser = await UserModel.findById(decodedToken.userID);

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

export default authenticateUser;
