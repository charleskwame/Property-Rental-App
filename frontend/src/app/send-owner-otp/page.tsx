"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";

export default function SendRenterOTP() {
	const routeToVerifyOwnerOTP = useRouter();
	const routerToGoBackToLogIn = useRouter();
	const [email, setEmail] = useState<string>("");

	useEffect(() => {
		const storedOwnerData = JSON.parse(`${localStorage.getItem("Owner")}`);
		if (storedOwnerData === null) {
			routerToGoBackToLogIn.push("/login-owner");
		}
	});

	setTimeout(() => {
		const storedOwnerData = JSON.parse(`${localStorage.getItem("Owner")}`);
		setEmail(storedOwnerData.data.ownerWithoutPassword.email);
		//console.log(storedRenterData);
	}, 2000);

	const handleOTPSubmission = async (event: React.FormEvent) => {
		event.preventDefault();
		const storedOwnerData = JSON.parse(`${localStorage.getItem("Owner")}`);
		//console.log(storedRenterData);

		const token = `Bearer ${storedOwnerData.data.token}`;

		const formData = {
			userID: storedOwnerData.data.ownerWithoutPassword._id,
			email,
		};
		try {
			const request = await axios.post(`${API_URL}owners/send-owner-otp`, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});
			//setIsSendingOTP(!isSendingOTP);
			if (request.data.status === "Pending") {
				//console.log(request.data);
				routeToVerifyOwnerOTP.push("/verify-owner");
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
