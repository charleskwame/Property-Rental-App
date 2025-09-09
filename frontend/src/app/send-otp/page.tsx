"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { useEffect } from "react";
import { GoToPageFunction } from "../functions/gotoLogin.function";

export default function SendRenterOTP() {
	//const routeToVerifyRenterOTP = useRouter();
	const route = useRouter();
	//const routerForProperties = useRouter();
	const [email, setEmail] = useState<string>("");

	useEffect(() => {
		if (localStorage.getItem("User") !== null) {
			const storedUserData = JSON.parse(`${localStorage.getItem("User")}`);
			// if (storedRenterData === null) {
			// }
			if (storedUserData.data.userWithoutPassword.isVerified === true) {
				route.push("/properties-for-rent");
			}
			setTimeout(() => {
				setEmail(storedUserData.data.userWithoutPassword.email);
			}, 2000);
			//console.log(storedUserData);
		}
		//GoToPageFunction(route, "/");
	});

	// setTimeout(() => {
	// 	const storedUserData = JSON.parse(`${localStorage.getItem("User")}`);
	// 	setEmail(storedUserData.data.userWithoutPassword.email);
	// 	//console.log(storedRenterData);
	// }, 3000);

	const handleOTPSubmission = async (event: React.FormEvent) => {
		event.preventDefault();
		const storedUserData = JSON.parse(`${localStorage.getItem("User")}`);
		//console.log(storedRenterData);

		const token = `Bearer ${storedUserData.data.token}`;

		const formData = {
			userID: storedUserData.data.userWithoutPassword._id,
			email,
		};
		try {
			const request = await axios.post(`${API_URL}user/send-otp`, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});
			//setIsSendingOTP(!isSendingOTP);
			if (request.data.status === "Pending") {
				//console.log(request.data);
				route.push("/verify-user");
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
