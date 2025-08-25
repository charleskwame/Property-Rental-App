import express from "express";

const app = express();

app.listen(5050, () => {
	console.log("running on port");
});

export default app;
