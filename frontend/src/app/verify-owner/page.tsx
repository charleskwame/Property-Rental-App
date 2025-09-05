"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";

export default function VerifyOwner() {
	const routerForPropertiesForOwner = useRouter();
	const routerToVerifyOwnerOTP = useRouter();
	const [otp, setOtp] = useState<string>("");

	// setTimeout(() => {
	// 	const storedRenterData = JSON.parse(`${localStorage.getItem("Renter")}`);
	// 	setEmail(storedRenterData.data.renterWithoutPassword.email);
	// 	//console.log(storedRenterData);
	// }, 3000);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const storedOwnerData = JSON.parse(`${localStorage.getItem("Owner")}`);
		console.log(storedOwnerData.data.token);

		const token = `Bearer ${storedOwnerData.data.token}`;

		const formData = {
			userID: `${storedOwnerData.data.ownerWithoutPassword._id}`,
			otp,
		};
		try {
			const request = await axios.post(`${API_URL}owners/verify-owner-otp`, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});
			if (request.data.status === "Success") {
				//console.log(request.data);
				routerForPropertiesForOwner.push("/properties-for-owner");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleOTPSubmission = async (event: React.FormEvent) => {
		event.preventDefault();
		const storedOwnerData = JSON.parse(`${localStorage.getItem("Owner")}`);
		//console.log(storedOwnerData.data.token);

		const token = `Bearer ${storedOwnerData.data.token}`;

		const formData = {
			userID: storedOwnerData.data.ownerWithoutPassword._id,
			email: storedOwnerData.data.ownerWithoutPassword.email,
		};
		try {
			const request = await axios.post(`${API_URL}owners/resend-owner-otp`, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});
			//setIsSendingOTP(!isSendingOTP);
			if (request.data.status === "Pending") {
				//console.log(request.data);
				routerToVerifyOwnerOTP.push("/verify-owner");
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
