"use client";

import axios from "axios";
import { useState } from "react";
import { API_URL } from "@/config";
import { useRouter } from "next/navigation";

export default function SignUpRenter() {
	const routeToVerifyOwnerOTP = useRouter();
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [phonenumber, setPhonenumber] = useState<string>("");
	const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const formData = {
			name,
			email,
			password,
			phonenumber,
		};
		try {
			const request = await axios.post(`${API_URL}owners/sign-up`, formData, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (request.data.status === "Success") {
				setIsSendingOTP(!isSendingOTP);
				localStorage.setItem("Owner", JSON.stringify(request.data));
				//console.log(request.data);
				//routeToAllOwnerProperties.push("/propertiesForOwner");
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
			email,
		};
		console.log(formData);
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
			{!isSendingOTP ? (
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
			) : (
				<form onSubmit={(event) => handleOTPSubmission(event)}>
					<label htmlFor="">Email</label>
					<input type="text" value={email} />
					<button>Send OTP</button>
				</form>
			)}
		</>
	);
}
