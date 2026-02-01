"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import Logo from "../../../public/assets/logo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavBarDecorative from "@/components/navbardecorative.component";
import { toast } from "react-toastify";

type TabType = "update" | "delete";

export default function AccountSettings() {
	const route = useRouter();
	const [activeTab, setActiveTab] = useState<TabType>("update");
	const [userName, setUserName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [deleteConfirmText, setDeleteConfirmText] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		// get all current user details
		const unparsedUserDetails = sessionStorage.getItem("User");
		const parsedUserDetails = JSON.parse(unparsedUserDetails!);
		setUserName(parsedUserDetails.data.userWithoutPassword.name);
		setEmail(parsedUserDetails.data.userWithoutPassword.email);
	}, []);

	const handleUpdate = async (event: React.FormEvent) => {
		event.preventDefault();
		const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
		const userID = storedUserData.data.userWithoutPassword._id;
		const token = `Bearer ${storedUserData.data.token}`;

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
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

				location.reload();
			}
		} catch (error) {
			toast.error("Update Failed");
			console.log(error);
		}
	};

	const handleDeleteAccount = async () => {
		if (deleteConfirmText !== "DELETE MY ACCOUNT") {
			toast.error("Please type 'DELETE MY ACCOUNT' to confirm");
			return;
		}

		setIsDeleting(true);
		const storedUserData = JSON.parse(`${sessionStorage.getItem("User")}`);
		const token = `Bearer ${storedUserData.data.token}`;

		try {
			const response = await axios.delete(`${API_URL}user/delete-account`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			});

			if (response.status === 200) {
				toast.success("Account deleted successfully. Logging out...");
				// Clear all session storage immediately
				sessionStorage.clear();
				// Redirect to main page after a short delay
				setTimeout(() => {
					route.push("/");
				}, 1500);
			}
		} catch (error) {
			setIsDeleting(false);
			toast.error("Failed to delete account");
			console.log(error);
		}
	};

	return (
		<>
			<NavBarDecorative />
			<main className="min-h-screen bg-gray-50 py-8 px-4">
				<div className="max-w-2xl mx-auto">
					{/* Tabs */}
					<div className="bg-white rounded-lg shadow-lg overflow-hidden">
						<div className="flex border-b border-gray-200">
							<button
								onClick={() => setActiveTab("update")}
								className={`flex-1 py-2.5 px-4 font-semibold text-sm text-center transition-all ${
									activeTab === "update"
										? "text-fuchsia-800 border-b-2 border-fuchsia-800 bg-fuchsia-50"
										: "text-gray-600 hover:text-fuchsia-800"
								}`}>
								Update Account
							</button>
							<button
								onClick={() => setActiveTab("delete")}
								className={`flex-1 py-2.5 px-4 font-semibold text-sm text-center transition-all ${
									activeTab === "delete"
										? "text-red-800 border-b-2 border-red-800 bg-red-50"
										: "text-gray-600 hover:text-red-800"
								}`}>
								Delete Account
							</button>
						</div>

						{/* Tab Content */}
						<div className="p-5">
							{/* Update Account Tab */}
							{activeTab === "update" && (
								<form onSubmit={handleUpdate} className="space-y-2.5">
									<div className="flex items-center gap-2 mb-3">
										<Image src={Logo} alt="Rent Easy Logo" className="size-8" />
										<h2 className="text-lg font-bold text-fuchsia-800">Update Account Details</h2>
									</div>

									<div>
										<label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-1">
											Username
										</label>
										<input
											id="username"
											type="text"
											value={userName}
											onChange={(e) => setUserName(e.target.value)}
											className="w-full border border-gray-300 bg-white outline-none rounded py-1.5 px-2 text-sm focus:border-fuchsia-800 focus:ring-1 focus:ring-fuchsia-800 transition-all"
										/>
									</div>

									<div>
										<label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
											Email
										</label>
										<input
											id="email"
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="w-full border border-gray-300 bg-white outline-none rounded py-1.5 px-2 text-sm focus:border-fuchsia-800 focus:ring-1 focus:ring-fuchsia-800 transition-all"
										/>
									</div>

									<div>
										<label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
											New Password
										</label>
										<input
											id="password"
											type="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="w-full border border-gray-300 bg-white outline-none rounded py-1.5 px-2 text-sm focus:border-fuchsia-800 focus:ring-1 focus:ring-fuchsia-800 transition-all"
										/>
									</div>

									<div>
										<label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
											Confirm Password
										</label>
										<input
											id="confirmPassword"
											type="password"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											className="w-full border border-gray-300 bg-white outline-none rounded py-1.5 px-2 text-sm focus:border-fuchsia-800 focus:ring-1 focus:ring-fuchsia-800 transition-all"
										/>
									</div>

									<button
										type="submit"
										className="w-full mt-3 bg-fuchsia-800 font-semibold text-sm hover:bg-fuchsia-900 transition-all py-2 rounded text-white cursor-pointer">
										Update Details
									</button>
								</form>
							)}

							{/* Delete Account Tab */}
							{activeTab === "delete" && (
								<div className="space-y-2.5">
									<div className="flex items-center gap-2 mb-3">
										<div className="p-1.5 bg-red-100 rounded-full">
											<svg
												className="w-5 h-5 text-red-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 9v2m0 4v2m0 4v2m8-6a9 9 0 11-18 0 9 9 0 0118 0zm-9-5a1 1 0 00-1 1v3a1 1 0 002 0V9a1 1 0 00-1-1z"
												/>
											</svg>
										</div>
										<h2 className="text-lg font-bold text-red-800">Delete Account</h2>
									</div>

									<div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
										<p className="text-red-800 font-semibold mb-1 text-sm">This action cannot be undone.</p>
										<p className="text-red-700 text-xs">Deleting your account will:</p>
										<ul className="text-red-700 text-xs mt-1 ml-4 list-disc space-y-0.5">
											<li>Permanently delete your account</li>
											<li>Cancel all your pending or confirmed reservations</li>
											<li>Remove all properties you&apos;ve listed</li>
										</ul>
									</div>

									{!showDeleteConfirm ? (
										<button
											onClick={() => setShowDeleteConfirm(true)}
											className="w-full bg-red-600 font-semibold text-sm hover:bg-red-700 transition-all py-2 rounded text-white cursor-pointer">
											Delete My Account
										</button>
									) : (
										<div className="space-y-2.5 p-3 bg-gray-50 border border-gray-200 rounded-lg">
											<p className="text-gray-700 font-semibold text-sm">
												Type &quot;DELETE MY ACCOUNT&quot; to confirm:
											</p>
											<input
												type="text"
												value={deleteConfirmText}
												onChange={(e) => setDeleteConfirmText(e.target.value)}
												placeholder="Type here to confirm"
												className="w-full border border-gray-300 bg-white outline-none rounded py-1.5 px-2 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
											/>
											<div className="flex gap-2">
												<button
													onClick={() => {
														setShowDeleteConfirm(false);
														setDeleteConfirmText("");
													}}
													className="flex-1 bg-gray-300 font-semibold text-sm hover:bg-gray-400 transition-all py-1.5 rounded text-gray-800 cursor-pointer">
													Cancel
												</button>
												<button
													onClick={handleDeleteAccount}
													disabled={isDeleting}
													className="flex-1 bg-red-600 font-semibold text-sm hover:bg-red-700 disabled:bg-red-400 transition-all py-1.5 rounded text-white cursor-pointer">
													{isDeleting ? "Deleting..." : "Permanently Delete"}
												</button>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
