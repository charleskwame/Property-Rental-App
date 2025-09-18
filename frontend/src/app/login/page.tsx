"use client";

import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { API_URL } from "@/config";
import { useRouter } from "next/navigation";
import { GoToPageFunction } from "@/app/functions/gotoLogin.function";
import { XCircleIcon } from "@heroicons/react/24/outline";
import Logo from "../../../public/assets/logo.svg";
import Image from "next/image";
import NavBarDecorative from "@/components/navbardecorative.component";
import { toast } from "react-toastify";
import Toast from "@/components/toast.component";

export default function SignUpRenter() {
	const route = useRouter();
	//const dialogRef = useRef(null);
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [phonenumber, setPhonenumber] = useState<string>("");
	const [usertype, setUsertype] = useState<string>("");
	const [openLogIn, setOpenLogIn] = useState<boolean>(false);
	//const [closeDialog, setCloseDialog] = useState<boolean>(true);
	//const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false);

	// log in email and password
	const [logInEmail, setLogInEmail] = useState<string>("");
	const [logInPassword, setLogInPassword] = useState<string>("");
	const handleSignUp = async (event: React.FormEvent) => {
		event.preventDefault();

		const formData = {
			name,
			email,
			password,
			phonenumber,
			usertype,
		};
		console.log(formData);
		// return;
		try {
			const request = await axios.post(`${API_URL}user/sign-up`, formData, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (request.data.status === "Success") {
				//setIsSendingOTP(!isSendingOTP);
				toast.success("Please verify your email");
				sessionStorage.setItem("User", JSON.stringify(request.data));
				route.push("/send-otp");
				//console.log(request.data);
				//routeToAllOwnerProperties.push("/propertiesForOwner");
			}
		} catch (error) {
			console.log(error);
		}
	};

	// useEffect(() => {
	// 	if (sessionStorage.getItem("RenterLogInStatus") !== null) {
	// 		const unparsedLogInStatus = sessionStorage.getItem("RenterLogInStatus");
	// 		if (unparsedLogInStatus !== null) {
	// 			const logInStatus = JSON.parse(unparsedLogInStatus);
	// 			console.log(logInStatus);
	// 			if (logInStatus.loggedin === true) {
	// 				GoToPageFunction(route, "/");
	// 			}
	// 		}
	// 	}
	// });

	const handleLogIn = async (event: React.FormEvent) => {
		event.preventDefault();

		const formData = {
			email: logInEmail,
			password: logInPassword,
		};

		console.log(formData);

		try {
			const request = await axios.post(`${API_URL}user/log-in`, formData, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (request.data.status === "Pending Verification") {
				toast.info("Please verify your email");
				sessionStorage.setItem("User", JSON.stringify(request.data));
				route.push("/send-otp");
			}

			if (request.data.status === "Success") {
				toast.success("Logged in successfully");
				sessionStorage.setItem("User", JSON.stringify(request.data));
				sessionStorage.setItem("UserLoggedIn", JSON.stringify({ loggedin: true }));
				route.push("/");
				//console.log(request.data);
				//console.log(request.data.renterWithoutPassword);
				location.reload();
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Toast />
			<NavBarDecorative />
			{openLogIn ? (
				// sign up form
				<form
					className="bg-custom-white-50 text-gray-500  p-4 py-4 text-left text-sm rounded-2xl shadow-[0px_0px_10px_0px] shadow-black/10 lg:max-w-1/3 w-[90%] fixed -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
					onSubmit={(event) => handleSignUp(event)}
				>
					<div className="flex items-center gap-2 mb-1">
						<Image src={Logo} alt="Rent Easy Logo" className="size-10" />
						<h2 className="text-xl font-bold text-center text-fuchsia-800">Create an account</h2>
					</div>

					<input
						id="name"
						className="w-full border mt-1 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800"
						type="text"
						placeholder="Username"
						required
						value={name}
						onChange={(event) => setName(event?.target.value)}
					/>

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

					<input
						id="email"
						className="w-full border mt-1 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800"
						type="text"
						placeholder="Phonenumber"
						required
						value={phonenumber}
						onChange={(event) => setPhonenumber(event?.target.value)}
					/>

					<select
						name="usertype"
						id=""
						className="w-full border mt-1 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800 mb-3"
						required
						value={usertype}
						onChange={(event) => setUsertype(event?.target.value)}
					>
						<option value="">Select Type</option>
						<option value="renter">Renter</option>
						<option value="owner">Owner</option>
					</select>

					<button
						type="submit"
						className="w-full mb-3 bg-fuchsia-800 font-semibold hover:bg-custom-white-50 hover:text-fuchsia-800 hover:border-fuchsia-800 border transition-all py-2.5 rounded text-white cursor-pointer"
					>
						Create Account
					</button>

					<p className="text-center mt-4">
						Already have an account?{" "}
						<button
							type="button"
							className="text-orange-400 underline cursor-pointer"
							onClick={() => setOpenLogIn(false)}
						>
							Log In
						</button>
					</p>
				</form>
			) : (
				// log in form
				<form
					action=""
					className="bg-custom-white-50 text-gray-500  p-4 py-4 text-left text-sm rounded-2xl shadow-[0px_0px_10px_0px] shadow-black/10 lg:max-w-1/3 w-[90%] fixed -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
					onSubmit={(event) => handleLogIn(event)}
				>
					<div className="flex items-center gap-2 mb-1">
						<Image src={Logo} alt="Rent Easy Logo" className="size-10" />
						<h2 className="text-xl font-bold text-center text-fuchsia-800">Welcome back</h2>
					</div>
					{/* <h2 className="text-xl font-bold mb-2 text-center text-fuchsia-800">Welcome back</h2> */}

					<input
						id="email"
						className="w-full border mt-1 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800"
						type="email"
						placeholder="Email"
						required
						value={logInEmail}
						onChange={(event) => setLogInEmail(event?.target.value)}
					/>

					<input
						id="email"
						className="w-full border mt-1 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800 mb-3"
						type="text"
						placeholder="Password"
						required
						value={logInPassword}
						onChange={(event) => setLogInPassword(event?.target.value)}
					/>

					{/* <button type="submit">Log in</button> */}
					<button
						type="submit"
						className="w-full mb-3 bg-fuchsia-800 font-semibold hover:bg-custom-white-50 hover:text-fuchsia-800 hover:border-fuchsia-800 border transition-all py-2.5 rounded text-white cursor-pointer"
					>
						Log In
					</button>

					<p className="text-center mt-4">
						Don&apos;t have an account?{" "}
						<button
							type="button"
							className="text-orange-400 underline cursor-pointer"
							onClick={() => setOpenLogIn(true)}
						>
							Sign up
						</button>
					</p>
				</form>
			)}
			{/* </dialog> */}
		</>
	);
}
