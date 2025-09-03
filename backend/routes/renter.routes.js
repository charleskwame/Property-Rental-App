import Router from "express";
import {
	addRenter,
	getProperties,
	getPropertiesByID,
	getRenter,
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

RenterRouter.get("/properties", autheticateRenter, getProperties);

RenterRouter.get("/properties/:propertyID", authenticateRenter, getPropertiesByID);

export default RenterRouter;
