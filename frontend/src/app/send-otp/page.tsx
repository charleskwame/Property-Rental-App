"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { useEffect } from "react";

import Logo from "../../../public/assets/logo.svg";
import Image from "next/image";
import { toast } from "react-toastify";
import NavBarDecorative from "@/components/navbardecorative.component";

export default function SendRenterOTP() {
	const route = useRouter();

	const [email, setEmail] = useState<string>("");

	useEffect(() => {
		if (sessionStorage.getItem("User") !== null) {
			const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);

			if (storedUserData.data.userWithoutPassword.isVerified === true) {
				toast.success("Email Already Verified");
				route.push("/properties-for-rent");
			}
			setTimeout(() => {
				setEmail(storedUserData.data.userWithoutPassword.email);
			}, 2000);
		}
	});

	const handleOTPSubmission = async (event: React.FormEvent) => {
		event.preventDefault();
		const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);

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

			if (request.status === 200) {
				const body = {
					otpCode: request.data.data.otp,
					userName: storedUserData.data.userWithoutPassword.name,
					email: storedUserData.data.userWithoutPassword.email,
				};

				try {
					const response = await fetch("/api/send-otp-email", {
						method: "POST",
						cache: "no-cache",
						body: JSON.stringify(body),
						headers: {
							"Content-Type": "application/json",
						},
					});

					if (!response.ok) {
						toast.error("OTP Email Not Sent, Try Again");

						return;
					}

					toast.success("OTP Sent To Your Inbox");
					route.push("/verify-user");
				} catch (error) {
					toast.error("Network Error, OTP Not Sent");
					console.log(error);
				}
			}
		} catch (error) {
			toast.error("Failed to send OTP");
			console.log(error);
		}
	};
	return (
		<>
			<NavBarDecorative />
			<main>
				<form
					className="fixed w-[90%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:max-w-1/2"
					onSubmit={(event) => handleOTPSubmission(event)}>
					<div className="flex items-center gap-2 mb-1">
						<Image src={Logo} alt="Rent Easy Logo" className="size-10" />
						<h2 className="text-xl font-bold text-center text-fuchsia-800">Verify Email</h2>
					</div>

					<div className="flex items-center border gap-2 bg-white border-gray-500/30 h-12 rounded-full overflow-hidden ">
						<input
							type="email"
							placeholder="Enter your email"
							className="w-full h-full pl-6 outline-none text-sm bg-transparent placeholder-gray-500 font-semibold text-fuchsia-800"
							required
							defaultValue={email}
						/>

						<button
							type="submit"
							className="bg-fuchsia-800 w-32 lg:w-56 h-10 rounded-full text-sm text-white font-semibold cursor-pointer mr-1 hover:bg-custom-white-50 hover:border-fuchsia-800 border hover:text-fuchsia-800 transition-all duration-300 ease-in-out">
							Send OTP
						</button>
					</div>
				</form>
			</main>
		</>
	);
}
