"use client";

import axios from "axios";
import { useState } from "react";
import { API_URL } from "@/config";
import { useRouter } from "next/navigation";
import { GoToPageFunction } from "../functions/gotoLogin.function";

export default function SignUpRenter() {
	const route = useRouter();
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
			const request = await axios.post(`${API_URL}owners/sign-up`, formData, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (request.data.status === "Success") {
				//setIsSendingOTP(!isSendingOTP);
				localStorage.setItem("Owner", JSON.stringify(request.data));
				route.push("/send-owner-otp");
				//console.log(request.data);
				//routeToAllOwnerProperties.push("/propertiesForOwner");
			}
		} catch (error) {
			console.log(error);
		}
	};

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
				<button type="submit">Sign up</button>
				<button type="button" onClick={() => GoToPageFunction(route, "/login-owner")}>
					Log In
				</button>
			</form>
		</>
	);
}
