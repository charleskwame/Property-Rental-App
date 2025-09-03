"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import API_URL from "@/config";

export default function VerifyRenter() {
	const routeToPropertiesForRent = useRouter();
	const [otp, setOtp] = useState<string>("");

	const token =
		"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2OGI4OTJiODc0NzFiM2RmNTVjNDU4YmIiLCJpYXQiOjE3NTY5MjY2NDgsImV4cCI6MTc1NzAxMzA0OH0.z7VxmKKHiqKfn4JqECD6JTXUIHtGVbQq5F7ReHwY83s";
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const formData = {
			userID: "68b892b87471b3df55c458bb",
			otp,
		};
		try {
			const request = await axios.post(`${API_URL}renters/verify-renter-otp`, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});
			if (request.data.status === "Success") {
				//console.log(request.data);
				routeToPropertiesForRent.push("/propertiesForRent");
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<form onSubmit={(event) => handleSubmit(event)}>
				<label htmlFor="">otp code</label>
				<input type="text" value={otp} onChange={(event) => setOtp(event?.target.value)} />
				<button>Submit OTP</button>
			</form>
		</>
	);
}
