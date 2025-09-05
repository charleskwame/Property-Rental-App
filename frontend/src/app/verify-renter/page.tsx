"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { useEffect } from "react";

export default function VerifyRenter() {
	const routeToPropertiesForRent = useRouter();
	const routeToVerifyRenterOTP = useRouter();
	const routerToGoBackToLogIn = useRouter();
	const [otp, setOtp] = useState<string>("");

	useEffect(() => {
		const storedRenterData = JSON.parse(`${localStorage.getItem("Renter")}`);
		if (storedRenterData === null) {
			routerToGoBackToLogIn.push("/login-renter");
		}
	});

	//console.log(storedRenterData.data.token);
	// setTimeout(() => {
	// 	const storedRenterData = JSON.parse(`${localStorage.getItem("Renter")}`);
	// 	//setEmail(storedRenterData.data.renterWithoutPassword.email);
	// 	//console.log(storedRenterData);
	// }, 3000);

	const handleSubmit = async (event: React.FormEvent) => {
		const storedRenterData = JSON.parse(`${localStorage.getItem("Renter")}`);
		event.preventDefault();
		const token = `Bearer ${storedRenterData.data.token}`;

		const formData = {
			userID: `${storedRenterData.data.renterWithoutPassword._id}`,
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
				routeToPropertiesForRent.push("/properties-for-rent");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleOTPSubmission = async (event: React.FormEvent) => {
		event.preventDefault();
		const storedRenterData = JSON.parse(`${localStorage.getItem("Renter")}`);
		//console.log(storedRenterData.data.token);

		const token = `Bearer ${storedRenterData.data.token}`;

		const formData = {
			userID: storedRenterData.data.renterWithoutPassword._id,
			email: storedRenterData.data.renterWithoutPassword.email,
		};
		try {
			const request = await axios.post(`${API_URL}renters/resend-renter-otp`, formData, {
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
			<form onSubmit={(event) => handleSubmit(event)}>
				<label htmlFor="">otp code</label>
				<input type="text" value={otp} onChange={(event) => setOtp(event?.target.value)} />
				<button>Submit OTP</button>
			</form>
			<p>Did not get OTP?</p>
			<button onClick={(event) => handleOTPSubmission(event)}>Resend OTP</button>
		</>
	);
}
