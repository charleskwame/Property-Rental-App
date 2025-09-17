"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { API_URL } from "@/config";
import { useRouter } from "next/navigation";
import { GoToPageFunction } from "@/app/functions/gotoLogin.function";
//import { json } from "stream/consumers";
import Link from "next/link";

type logInProps = {
	openlogindialog: boolean;
};

export default function LogIn({ openlogindialog }: logInProps) {
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
				sessionStorage.setItem("User", JSON.stringify(request.data));
				route.push("/send-otp");
			}

			if (request.data.status === "Success") {
				sessionStorage.setItem("User", JSON.stringify(request.data));
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
		<dialog
			open={openlogindialog}
			className="lg:fixed w-[90%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:max-w-1/2"
		>
			<form
				action=""
				className="bg-custom-white-50 text-gray-500  p-4 py-4 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10"
				onSubmit={(event) => handleSubmit(event)}
			>
				<input
					id="email"
					className="w-full border mt-1 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800"
					type="email"
					placeholder="Email"
					required
					value={email}
					onChange={(event) => setEmail(event?.target.value)}
				/>

				<input
					id="email"
					className="w-full border mt-1 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800"
					type="text"
					placeholder="Password"
					required
					value={password}
					onChange={(event) => setPassword(event?.target.value)}
				/>

				<button type="submit">Log in</button>

				<p className="text-center mt-4">
					Don&apos;t have an account?{" "}
					<button type="button" className="text-orange-400 underline cursor-pointer">
						Sign Up
					</button>
				</p>
			</form>
		</dialog>
	);
}
