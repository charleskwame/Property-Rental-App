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
import { error, log } from "console";
import { useForm, SubmitHandler } from "react-hook-form";

type FormInputs = {
	name?: string;
	email?: string;
	password?: string;
	phonenumber?: string;
	usertype?: string;
};

export default function SignUpRenter() {
	const route = useRouter();
	//const dialogRef = useRef(null);
	// const [name, setName] = useState<string>("");
	// const [email, setEmail] = useState<string>("");
	// const [password, setPassword] = useState<string>("");
	// const [phonenumber, setPhonenumber] = useState<string>("");
	// const [usertype, setUsertype] = useState<string>("");
	const [openLogIn, setOpenLogIn] = useState<boolean>(false);
	//const [closeDialog, setCloseDialog] = useState<boolean>(true);
	//const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false);

	// log in email and password
	// const [logInEmail, setLogInEmail] = useState<string>("");
	// const [logInPassword, setLogInPassword] = useState<string>("");

	// react hook form set up
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInputs>();

	const handleSignUp = async (formData: FormInputs) => {
		//console.log(formData);
		//return;
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

	const handleLogIn = async (formData: FormInputs) => {
		//console.log(formData);

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
					className="bg-custom-white-50 text-gray-500  p-3 text-left text-sm rounded-2xl shadow-[0px_0px_10px_0px] shadow-black/10 lg:max-w-1/3 w-[90%] fixed -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
					onSubmit={handleSubmit(handleSignUp)}
				>
					<div className="flex items-center gap-2 mb-1">
						<Image src={Logo} alt="Rent Easy Logo" className="size-10" />
						<h2 className="text-xl font-bold text-center text-fuchsia-800">Create an account</h2>
					</div>

					<div className="mt-1">
						<label htmlFor="" className="text-xs">
							User name
							{errors.name && <span className="text-red-500 text-xs"> ({errors.name.message}) </span>}
						</label>
						<input
							id="name"
							className="w-full border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800"
							type="text"
							placeholder="Username"
							{...register("name", {
								required: { value: true, message: "Name is required" },
								pattern: { value: /^[a-zA-Z\s]+$/, message: "Only characters are allowed" },
								minLength: { value: 3, message: "Minimum 3 characters" },
								maxLength: { value: 50, message: "Maximum 50 characters" },
							})}
						/>
					</div>

					<div className="mt-1">
						<label htmlFor="" className="text-xs">
							Email
							{errors.email && <span className="text-red-500 text-xs"> ({errors.email.message}) </span>}
						</label>
						<input
							id="email"
							className="w-full border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800"
							type="email"
							placeholder="Email"
							{...register("email", {
								required: { value: true, message: "Email is required" },
								pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
								minLength: { value: 8, message: "Minimum 8 characters" },
								maxLength: { value: 50, message: "Maximum 50 characters" },
							})}
						/>
					</div>

					<div className="mt-1">
						<label htmlFor="" className="text-xs">
							Password
							{errors.password && (
								<span className="text-red-500 text-xs"> ({errors.password.message}) </span>
							)}
						</label>
						<input
							id="password"
							className="w-full border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800"
							type="text"
							placeholder="Password"
							{...register("password", {
								required: { value: true, message: "Password is required" },
								pattern: {
									value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
									message: "Invalid password format",
								},
								minLength: { value: 8, message: "Minimum 8 characters" },
								maxLength: { value: 30, message: "Maximum 30 characters" },
							})}
						/>
					</div>

					<div className="mt-1">
						<label htmlFor="" className="text-xs">
							Phone Number
							{errors.phonenumber && (
								<span className="text-red-500 text-xs"> ({errors.phonenumber.message}) </span>
							)}
						</label>
						<input
							id="phonenumber"
							className="w-full border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800"
							type="text"
							placeholder="Phonenumber"
							{...register("phonenumber", {
								required: { value: true, message: "Phonenumber is required" },
								pattern: { value: /^\d{10}$/, message: "Invalid phonenumber" },
								minLength: { value: 10, message: "Minimum 10 characters" },
								maxLength: { value: 10, message: "Maximum 10 characters" },
							})}
						/>
					</div>

					<div className="mt-1">
						<label htmlFor="" className="text-xs">
							User Type
							{errors.usertype && (
								<span className="text-red-500 text-xs"> ({errors.usertype.message})</span>
							)}
						</label>
						<select
							id="usertype"
							className="w-full border mt-1uchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 text-xs focus:border-fuchsia-800 mb-3"
							{...register("usertype", {
								required: { value: true, message: "Usertype is required" },
								pattern: { value: /^(renter|owner)$/, message: "Invalid usertype" },
								minLength: { value: 1, message: "Minimum 1 characters" },
								maxLength: { value: 10, message: "Maximum 10 characters" },
							})}
						>
							<option value="">Select Type</option>
							<option value="renter">Renter</option>
							<option value="owner">Owner</option>
						</select>
					</div>

					<button
						type="submit"
						className="w-full bg-fuchsia-800 font-semibold hover:bg-custom-white-50 hover:text-fuchsia-800 hover:border-fuchsia-800 border transition-all py-2.5 rounded text-white cursor-pointer"
					>
						Create Account
					</button>

					<p className="text-center mt-2">
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
					className="bg-custom-white-50 text-gray-500  p-3 text-left text-sm rounded-2xl shadow-[0px_0px_10px_0px] shadow-black/10 lg:max-w-1/3 w-[90%] fixed -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
					onSubmit={handleSubmit(handleLogIn)}
				>
					<div className="flex items-center gap-2 mb-1">
						<Image src={Logo} alt="Rent Easy Logo" className="size-10" />
						<h2 className="text-xl font-bold text-center text-fuchsia-800">Welcome back</h2>
					</div>

					<div className="mt-1">
						<label htmlFor="" className="text-xs">
							Email
							{errors.email && <span className="text-red-500 text-xs"> ({errors.email.message}) </span>}
						</label>
						<input
							id="email"
							className="w-full border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800"
							type="email"
							placeholder="Email"
							{...register("email", {
								required: { value: true, message: "Email is required" },
								pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
								minLength: { value: 8, message: "Minimum 8 characters" },
								maxLength: { value: 50, message: "Maximum 50 characters" },
							})}
						/>
					</div>

					<div className="mt-1">
						<label htmlFor="" className="text-xs">
							Password
							{errors.password && (
								<span className="text-red-500 text-xs"> ({errors.password.message})</span>
							)}
						</label>
						<input
							id="password"
							className="w-full border bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2 text-xs px-3 focus:border-fuchsia-800"
							type="text"
							placeholder="Password"
							{...register("password", {
								required: { value: true, message: "Password is required" },
								pattern: {
									value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
									message: "Invalid password format",
								},
								minLength: { value: 8, message: "Minimum 8 characters" },
								maxLength: { value: 30, message: "Maximum 30 characters" },
							})}
						/>
					</div>

					{/* <button type="submit">Log in</button> */}
					<button
						type="submit"
						className="w-full bg-fuchsia-800 font-semibold hover:bg-custom-white-50 hover:text-fuchsia-800 hover:border-fuchsia-800 border transition-all py-2.5 rounded text-white cursor-pointer mt-2"
					>
						Log In
					</button>

					<p className="text-center mt-3">
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
