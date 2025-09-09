"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { useEffect } from "react";

export default function VerifyRenter() {
	const route = useRouter();
	const routeToVerifyRenterOTP = useRouter();
	const routerForProperties = useRouter();
	const routerToGoBackToLogIn = useRouter();
	const [otp, setOtp] = useState<string>("");

	useEffect(() => {
		if (sessionStorage.getItem("User") !== null) {
			const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
			// if (storedRenterData === null) {
			// }
			if (storedUserData.data.userWithoutPassword.isVerified === true) {
				route.push("/properties-for-rent");
			}
			// setTimeout(() => {
			// 	setEmail(storedUserData.data.userWithoutPassword.email);
			// }, 2000);
			//console.log(storedUserData);
		}
		// const storedRenterData = JSON.parse(`${sessionStorage.getItem("Renter")}`);
		// if (storedRenterData === null) {
		// 	routerToGoBackToLogIn.push("/login");
		// }
		// if (storedRenterData.isVerified === true) {
		// 	routerForProperties.push("/properties-for-rent");
		// }
	});

	//console.log(storedRenterData.data.token);
	// setTimeout(() => {
	// 	const storedRenterData = JSON.parse(`${sessionStorage.getItem("Renter")}`);
	// 	//setEmail(storedRenterData.data.renterWithoutPassword.email);
	// 	//console.log(storedRenterData);
	// }, 3000);

	const handleSubmit = async (event: React.FormEvent) => {
		const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
		event.preventDefault();
		// console.log(storedUserData);
		// return;
		const token = `Bearer ${storedUserData.data.token}`;

		const formData = {
			userID: `${storedUserData.data.userWithoutPassword._id}`,
			otp,
		};
		try {
			const request = await axios.post(`${API_URL}user/verify-otp`, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});
			if (request.data.status === "Success") {
				//console.log(request.data);
				sessionStorage.setItem("User", JSON.stringify(request.data));
				route.push("/");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const resendOTP = async (event: React.FormEvent) => {
		event.preventDefault();
		const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
		//console.log(storedRenterData.data.token);

		const token = `Bearer ${storedUserData.data.token}`;

		const formData = {
			userID: storedUserData.data.renterWithoutPassword._id,
			email: storedUserData.data.renterWithoutPassword.email,
		};
		try {
			const request = await axios.post(`${API_URL}user/resend-otp`, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});
			//setIsSendingOTP(!isSendingOTP);
			if (request.data.status === "Pending") {
				//console.log(request.data);
				routeToVerifyRenterOTP.push("/verify-user");
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
				<button type="submit">Submit OTP</button>
			</form>
			<p>Did not get OTP?</p>
			<button type="button" onClick={(event) => resendOTP(event)}>
				Resend OTP
			</button>
		</>
	);
}
