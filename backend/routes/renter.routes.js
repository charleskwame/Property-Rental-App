import Router from "express";

const RenterRouter = Router();

RenterRouter.post("/log-in", (request, response) => {
	response.status(200).json({ message: "Success loggin in" });
});

RenterRouter.get("/properties", (request, response) => {
	response.status(200).json({ message: "Success displaying properties" });
});

RenterRouter.get("/properties/:propertyID", (request, response) => {
	response.status(200).json({ message: "Success displaying particular properity" });
});

export default RenterRouter;
