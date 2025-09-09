"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { API_URL } from "@/config";
import { useRouter } from "next/navigation";
import { GoToPageFunction } from "../functions/gotoLogin.function";

export default function LogInOwner() {
	const route = useRouter();
	//const routerToVerifyOwner = useRouter();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	useEffect(() => {
		if (sessionStorage.getItem("OwnerLogInStatus") !== null) {
			const unparsedLogInStatus = sessionStorage.getItem("OwnerLogInStatus");
			if (unparsedLogInStatus !== null) {
				const logInStatus = JSON.parse(unparsedLogInStatus);
				//console.log(logInStatus);
				if (logInStatus.loggedin === true) {
					GoToPageFunction(route, "/properties-for-owner");
				}
			}
		}
	});

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const formData = {
			email,
			password,
		};
		try {
			const request = await axios.post(`${API_URL}owners/log-in`, formData, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (request.data.status === "Pending Verification") {
				localStorage.setItem("Owner", JSON.stringify(request.data));
				route.push("/send-owner-otp");
			}
			if (request.data.status === "Success") {
				localStorage.setItem("Owner", JSON.stringify(request.data));
				sessionStorage.setItem("OwnerLogInStatus", JSON.stringify({ loggedin: true }));
				//console.log(request.data);
				//console.log(request.data);
				route.push("/properties-for-owner");
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<form action="" onSubmit={(event) => handleSubmit(event)}>
				<label htmlFor="">Email</label>
				<input type="email" value={email} onChange={(event) => setEmail(event?.target.value)} />
				<label htmlFor="">Password</label>
				<input
					type="password"
					value={password}
					onChange={(event) => setPassword(event?.target.value)}
				/>

				<button>Log in</button>
			</form>
		</>
	);
}
