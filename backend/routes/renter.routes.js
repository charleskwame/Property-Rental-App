import Router from "express";
import {
	addRenter,
	getProperties,
	getPropertiesByID,
	getRenter,
} from "../controllers/renter.controller.js";

const RenterRouter = Router();

RenterRouter.post("/sign-up", addRenter);

RenterRouter.post("/log-in", getRenter);

RenterRouter.get("/properties", getProperties);

RenterRouter.get("/properties/:propertyID", getPropertiesByID);

export default RenterRouter;
