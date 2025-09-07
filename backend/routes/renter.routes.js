import Router from "express";
import {
	addPropertyToFavorites,
	addRenter,
	getProperties,
	getPropertiesByID,
	getRenter,
	removePropertyFromFavorites,
	resendRenterOTP,
	sendRenterOTP,
} from "../controllers/renter.controller.js";
import autheticateRenter from "../middleware/authenticaterenters.middleware.js";
import authenticateRenter from "../middleware/authenticaterenters.middleware.js";
import { verifyRenterOTP } from "../controllers/otp.controller.js";

const RenterRouter = Router();

RenterRouter.post("/sign-up", addRenter);

RenterRouter.post("/send-renter-otp", authenticateRenter, sendRenterOTP);

RenterRouter.post("/resend-renter-otp", autheticateRenter, resendRenterOTP);

RenterRouter.post("/verify-renter-otp", authenticateRenter, verifyRenterOTP);

RenterRouter.post("/log-in", getRenter);

RenterRouter.get("/properties", getProperties);

RenterRouter.get("/properties/:propertyID", getPropertiesByID);

RenterRouter.post("/properties/add-to-favorites", autheticateRenter, addPropertyToFavorites);

RenterRouter.post(
	"/properties/remove-from-favorites",
	autheticateRenter,
	removePropertyFromFavorites,
);

export default RenterRouter;
