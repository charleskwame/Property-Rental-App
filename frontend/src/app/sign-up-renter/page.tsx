"use client";

import axios from "axios";
import { useState } from "react";
import { API_URL } from "@/config";
import { useRouter } from "next/navigation";

export default function SignUpRenter() {
	const routeToVerifyRenterOTP = useRouter();
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [phonenumber, setPhonenumber] = useState<string>("");
	//const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false);
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const formData = {
			name,
			email,
			password,
			phonenumber,
		};
		try {
			const request = await axios.post(`${API_URL}renters/sign-up`, formData, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (request.data.status === "Success") {
				//setIsSendingOTP(!isSendingOTP);
				localStorage.setItem("Renter", JSON.stringify(request.data));
				//console.log(request.data);
				routeToVerifyRenterOTP.push("/send-renter-otp");
			}
		} catch (error) {
			console.log(error);
		}
	};

	// const handleOTPSubmission = async (event: React.FormEvent) => {
	// 	event.preventDefault();
	// 	const storedRenterData = JSON.parse(`${localStorage.getItem("Renter")}`);
	// 	//console.log(storedRenterData.data.token);

	// 	const token = `Bearer ${storedRenterData.data.token}`;

	// 	const formData = {
	// 		userID: storedRenterData.data.renterWithoutPassword._id,
	// 		email,
	// 	};
	// 	try {
	// 		const request = await axios.post(`${API_URL}renters/send-renter-otp`, formData, {
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				Authorization: token,
	// 			},
	// 		});
	// 		//setIsSendingOTP(!isSendingOTP);
	// 		if (request.data.status === "Pending") {
	// 			//console.log(request.data);
	// 			routeToVerifyRenterOTP.push("/verify-renter");
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	return (
		<>
			<form action="" onSubmit={(event) => handleSubmit(event)}>
				<label htmlFor="">Name</label>
				<input type="text" value={name} onChange={(event) => setName(event?.target.value)} />
				<label htmlFor="">Email</label>
				<input type="email" value={email} onChange={(event) => setEmail(event?.target.value)} />
				<label htmlFor="">Password</label>
				<input
					type="password"
					value={password}
					onChange={(event) => setPassword(event?.target.value)}
				/>
				<label htmlFor="">Phone number</label>
				<input
					type="tel"
					name=""
					id=""
					value={phonenumber}
					onChange={(event) => setPhonenumber(event?.target.value)}
				/>
				<button>Sign up</button>
			</form>
		</>
	);
}
