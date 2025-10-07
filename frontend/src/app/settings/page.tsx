"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import Logo from "../../../public/assets/logo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavBarDecorative from "@/components/navbardecorative.component";
import Toast from "@/components/toast.component";
import { toast } from "react-toastify";
// import { headers } from "next/headers";

export const runtime = "edge";

export default function AccountSettings() {
	const route = useRouter();
	const [userName, setUserName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	// const [bio, setBio] = useState<string>("");
	// const [avatar, setAvatar] = useState<string>("");
	// const [banner, setBanner] = useState<string>("");
	useEffect(() => {
		// get all current user details
		const unparsedUserDetails = sessionStorage.getItem("User");
		const parsedUserDetails = JSON.parse(unparsedUserDetails!);
		setUserName(parsedUserDetails.data.userWithoutPassword.name);
		setEmail(parsedUserDetails.data.userWithoutPassword.email);

		//console.log(parsedUserDetails);

		//const token = sessionStorage.getItem("token");
		//console.log(token);
	}, []);

	const handleUpdate = async (event: React.FormEvent) => {
		event.preventDefault();
		const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
		const userID = storedUserData.data.userWithoutPassword._id;
		const token = `Bearer ${storedUserData.data.token}`;
		//console.log(token);
		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}
		const updateData = {
			userID,
			name: userName,
			email: email,
			password: password,
		};
		try {
			const response = await axios.put(`${API_URL}user/update-details`, updateData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});
			if (response.status === 200) {
				toast.success("Update Pending, Please Verify Your Email Address");
				sessionStorage.setItem("User", JSON.stringify(response.data));
				route.push("/send-otp");
				//alert("Details updated successfully");
				location.reload();
			}
			//console.log(response);
		} catch (error) {
			toast.error("Update Failed");
			console.log(error);
		}
	};

	return (
		<>
			<Toast />
			<NavBarDecorative />
			<main>
				<form
					action=""
					onSubmit={(event) => handleUpdate(event)}
					className="bg-custom-white-50 text-gray-500  p-4 py-4 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10 fixed w-[90%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:max-w-1/3 grid gap-1">
					<div className="flex items-center gap-2 mb-1">
						<Image src={Logo} alt="Rent Easy Logo" className="size-10" />
						<h2 className="text-xl font-bold text-center text-fuchsia-800">Update Account Details</h2>
					</div>
					<div>
						<label htmlFor="">Change Username</label>
						<input
							type="text"
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
							className="w-full border mt-1 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800"
						/>
					</div>
					<label htmlFor="">Change Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full border mt-1 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800"
					/>
					<div>
						<label htmlFor="">Change Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full border mt-1 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800"
						/>
					</div>
					<div>
						<label htmlFor="">Confirm Password</label>
						<input
							type="confirm password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full border mt-1 bg-fuchsia-500/5 border-gray-500/10 outline-none rounded py-2.5 px-3 focus:border-fuchsia-800"
						/>
					</div>
					<button className="w-full mt-3 bg-fuchsia-800 font-semibold hover:bg-custom-white-50 hover:text-fuchsia-800 hover:border-fuchsia-800 border transition-all py-2.5 rounded text-white cursor-pointer">
						Update Details
					</button>
				</form>
			</main>
		</>
	);
}
