"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { useEffect } from "react";

export default function SendRenterOTP() {
	const routeToVerifyRenterOTP = useRouter();
	const routerToGoBackToLogIn = useRouter();
	const [email, setEmail] = useState<string>("");

	useEffect(() => {
		const storedRenterData = JSON.parse(`${localStorage.getItem("Renter")}`);
		if (storedRenterData === null) {
			routerToGoBackToLogIn.push("/login-renter");
		}
	});

	setTimeout(() => {
		const storedRenterData = JSON.parse(`${localStorage.getItem("Renter")}`);
		setEmail(storedRenterData.data.renterWithoutPassword.email);
		//console.log(storedRenterData);
	}, 3000);

	const handleOTPSubmission = async (event: React.FormEvent) => {
		event.preventDefault();
		const storedRenterData = JSON.parse(`${localStorage.getItem("Renter")}`);
		//console.log(storedRenterData);

		const token = `Bearer ${storedRenterData.data.token}`;

		const formData = {
			userID: storedRenterData.data.renterWithoutPassword._id,
			email,
		};
		try {
			const request = await axios.post(`${API_URL}renters/send-renter-otp`, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});
			//setIsSendingOTP(!isSendingOTP);
			if (request.data.status === "Pending") {
				//console.log(request.data);
				routeToVerifyRenterOTP.push("/verify-renter");
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<form action="" onSubmit={(event) => handleOTPSubmission(event)}>
				<label htmlFor="">email</label>
				<input type="text" defaultValue={email} />
				<button>Send otp</button>
			</form>
		</>
	);
}
