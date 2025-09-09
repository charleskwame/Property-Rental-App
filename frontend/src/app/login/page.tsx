"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { API_URL } from "@/config";
import { useRouter } from "next/navigation";
import { GoToPageFunction } from "../functions/gotoLogin.function";
//import { json } from "stream/consumers";
import Link from "next/link";

export default function LogInRenter() {
	const route = useRouter();
	//const route = useRouter();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	useEffect(() => {
		if (sessionStorage.getItem("RenterLogInStatus") !== null) {
			const unparsedLogInStatus = sessionStorage.getItem("RenterLogInStatus");
			if (unparsedLogInStatus !== null) {
				const logInStatus = JSON.parse(unparsedLogInStatus);
				console.log(logInStatus);
				if (logInStatus.loggedin === true) {
					GoToPageFunction(route, "/");
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
			const request = await axios.post(`${API_URL}user/log-in`, formData, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (request.data.status === "Pending Verification") {
				localStorage.setItem("User", JSON.stringify(request.data));
				route.push("/send-otp");
			}

			if (request.data.status === "Success") {
				localStorage.setItem("User", JSON.stringify(request.data));
				sessionStorage.setItem("UserLoggedIn", JSON.stringify({ loggedin: true }));
				//console.log(request.data);
				//console.log(request.data.renterWithoutPassword);
				route.push("/");
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
			<Link href={`/sign-up`}>Sign Up</Link>
		</>
	);
}
