"use client";

import axios from "axios";
import { useState } from "react";
import { API_URL } from "@/config";
import { useRouter } from "next/navigation";

export default function LogInRenter() {
	const routeToPropertiesForRent = useRouter();
	const routeToVerifyRenter = useRouter();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const formData = {
			email,
			password,
		};

		try {
			const request = await axios.post(`${API_URL}renters/log-in`, formData, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (request.data.status === "Pending Verification") {
				routeToVerifyRenter.push("/send-renter-otp");
			}

			if (request.data.status === "Success") {
				localStorage.setItem("Renter", JSON.stringify(request.data));
				//console.log(request.data);
				//console.log(request.data.renterWithoutPassword);
				routeToPropertiesForRent.push("/properties-for-rent");
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
