"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import { GoToPageFunction } from "../functions/gotoLogin.function";

export default function SendRenterOTP() {
	//const routeToVerifyOwnerOTP = useRouter();
	const route = useRouter();
	//const routerForPropertiesForOwner = useRouter();
	const [email, setEmail] = useState<string>("");

	useEffect(() => {
		if (localStorage.getItem("Owner") !== null) {
			const storedOwnerData = JSON.parse(`${localStorage.getItem("Owner")}`);

			if (storedOwnerData.data.ownerWithoutPassword.isVerified === true) {
				GoToPageFunction(route, "/properties-for-owner");
			}
			setTimeout(() => {
				setEmail(storedOwnerData.data.ownerWithoutPassword.email);
			}, 2000);
		}
		GoToPageFunction(route, "/properties-for-owner");
	});

	const handleOTPSubmission = async (event: React.FormEvent) => {
		event.preventDefault();
		const storedOwnerData = JSON.parse(`${localStorage.getItem("Owner")}`);

		const token = `Bearer ${storedOwnerData.data.token}`;

		const formData = {
			userID: storedOwnerData.data.ownerWithoutPassword._id,
			email,
		};
		try {
			const request = await axios.post(`${API_URL}owners/send-owner-otp`, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});

			if (request.data.status === "Pending") {
				GoToPageFunction(route, "/verify-owner");
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<form action="" onSubmit={(event) => handleOTPSubmission(event)}>
				<label htmlFor="">email</label>
				<input type="text" defaultValue={email} />
				<button>Send otp</button>
			</form>
		</>
	);
}
