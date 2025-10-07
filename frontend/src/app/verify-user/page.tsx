"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/config";
import Logo from "../../../public/assets/logo.svg";
import Image from "next/image";
import NavBarDecorative from "@/components/navbardecorative.component";
import Toast from "@/components/toast.component";
import { toast } from "react-toastify";

export const runtime = "edge";

export default function VerifyRenter() {
	const router = useRouter();
	const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	// Redirect if already verified
	useEffect(() => {
		const storedUserData = sessionStorage.getItem("User");
		if (storedUserData) {
			const parsed = JSON.parse(storedUserData);
			if (parsed?.data?.userWithoutPassword?.isVerified === true) {
				toast.success("Email Already Verified");
				router.push("/properties-for-rent");
			}
		}
	}, []);

	// Handle input change
	const handleChange = (value: string, index: number) => {
		if (!/^\d?$/.test(value)) return; // allow only single digit or empty
		const newDigits = [...otpDigits];
		newDigits[index] = value;
		setOtpDigits(newDigits);

		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	// Handle backspace
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	// Handle paste of full 6-digit OTP
	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const data = e.clipboardData.getData("text").trim();
		if (/^\d{6}$/.test(data)) {
			const newDigits = data.split("");
			setOtpDigits(newDigits);
			inputRefs.current[5]?.focus();
		}
	};

	// Submit OTP
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const otp = otpDigits.join("");
		console.log(otp);
		if (otp.length !== 6) {
			toast.error("Please enter a 6-digit OTP.");
			console.error("Please enter a 6-digit OTP.");
			return;
		}

		const storedUserData = sessionStorage.getItem("User");
		if (!storedUserData) return;

		const parsed = JSON.parse(storedUserData);
		const token = `Bearer ${parsed.data.token}`;

		const formData = {
			userID: parsed.data.userWithoutPassword._id,
			otp,
		};

		try {
			const response = await axios.post(`${API_URL}user/verify-otp`, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});

			if (response.data.status === "Success") {
				toast.success("Email Verified Successfully");
				sessionStorage.setItem("User", JSON.stringify(response.data));
				sessionStorage.setItem("UserLoggedIn", JSON.stringify({ loggedin: true }));
				router.push("/");
			}
		} catch (error) {
			toast.error("Verification failed, please try again.");
			console.error("Verification failed:", error);
		}
	};

	// Resend OTP
	const resendOTP = async () => {
		const storedUserData = sessionStorage.getItem("User");
		if (!storedUserData) return;

		const parsed = JSON.parse(storedUserData);
		const token = `Bearer ${parsed.data.token}`;

		const formData = {
			userID: parsed.data.userWithoutPassword._id,
			email: parsed.data.userWithoutPassword.email,
		};

		try {
			const response = await axios.post(`${API_URL}user/resend-otp`, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});

			if (response.data.status === "Pending") {
				toast.success("OTP resent successfully");
				console.log("OTP resent successfully");
			}
		} catch (error) {
			toast.success("Failed to resend OTP");
			console.error("Failed to resend OTP:", error);
		}
	};

	return (
		<>
			<Toast />
			<NavBarDecorative />
			<main>
				<form
					className="bg-white text-gray-500 lg:max-w-80 px-4 py-4 text-left text-sm rounded-lg transition-all shadow-[0px_0px_10px_0px] shadow-black/10 fixed w-[90%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
					onSubmit={handleSubmit}>
					<div className="flex items-center gap-2 mb-1">
						<Image src={Logo} alt="Rent Easy Logo" className="size-10" />
						<h2 className="text-xl font-bold text-center text-fuchsia-800">OTP Verification</h2>
					</div>
					{/* <h2 className="text-2xl font-semibold mb-2 text-center text-fuchsia-800">OTP Verification</h2> */}

					<p className="text-gray-500/60">Please enter the verification code</p>
					<p className="text-gray-500/60 mb-2">Verification code has been sent to your email</p>

					<div className="flex items-center justify-between mb-4">
						{otpDigits.map((digit, index) => (
							<input
								key={index}
								ref={(el) => {
									inputRefs.current[index] = el;
								}}
								className="otp-input w-10 h-10 border border-gray-300 outline-none rounded text-center text-lg focus:border-fuchsia-800 transition duration-300"
								type="text"
								maxLength={1}
								required
								value={digit}
								onChange={(e) => handleChange(e.target.value, index)}
								onKeyDown={(e) => handleKeyDown(e, index)}
								onPaste={index === 0 ? handlePaste : undefined}
								inputMode="numeric"
							/>
						))}
					</div>

					<button
						type="submit"
						className="w-full bg-fuchsia-800 py-2.5 rounded text-white transition-all hover:border-fuchsia-800 hover:text-fuchsia-800 hover:bg-white font-semibold border duration-300 ease-in-out cursor-pointer">
						Verify
					</button>

					<p className="text-center mt-2">
						Didn&apos;t get OTP Code?{" "}
						<button
							type="button"
							className="text-orange-400 underline cursor-pointer"
							onClick={resendOTP}>
							Resend Code
						</button>
					</p>
				</form>
			</main>
		</>
	);
}
