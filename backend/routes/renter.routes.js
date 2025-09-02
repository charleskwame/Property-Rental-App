import Router from "express";
import {
	addRenter,
	getProperties,
	getPropertiesByID,
	getRenter,
} from "../controllers/renter.controller.js";
import autheticateRenter from "../middleware/authenticaterenters.middleware.js";
import authenticateRenter from "../middleware/authenticaterenters.middleware.js";

const RenterRouter = Router();

RenterRouter.post("/sign-up", addRenter);

RenterRouter.post("/log-in", getRenter);

RenterRouter.get("/properties", autheticateRenter, getProperties);

RenterRouter.get("/properties/:propertyID", authenticateRenter, getPropertiesByID);

export default RenterRouter;
