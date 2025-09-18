"use client";

import Link from "next/link";
import {
	UserCircleIcon,
	XCircleIcon,
	HeartIcon,
	Cog8ToothIcon,
	ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { GoToPageFunction } from "@/app/functions/gotoLogin.function";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "../../public/assets/logo.svg";
import Image from "next/image";
import SignUpRenter from "./signup.component";
import { useRef } from "react";
import Toast from "@/components/toast.component";
import { toast } from "react-toastify";
//import SignUpRenter from "@/app/sign-up/page";

export default function NavBar() {
	const route = useRouter();
	const dialogRef = useRef(null);
	const [displayProfileIcon, setDisplayProfileIcon] = useState<boolean>(false);
	const [profileIconLetter, setProfileIconLetter] = useState<string>("");
	const [isUserTypeKnown, setIsUserTypeKnown] = useState<boolean>(false);
	const [isUserOwner, setIsUserOwner] = useState<boolean>(false);
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [openSignUpDialog, setOpenSignUpDialog] = useState<boolean>(false);
	useEffect(() => {
		if (
			JSON.parse(`${sessionStorage.getItem("User")}`) !== null &&
			sessionStorage.getItem("UserLoggedIn") !== null &&
			JSON.parse(`${sessionStorage.getItem("UserLoggedIn")}`).loggedin === true
		) {
			const unparsedUserData = sessionStorage.getItem("User");
			const storedUserData = JSON.parse(unparsedUserData!);
			const userName: string = storedUserData.data.userWithoutPassword.name;
			setProfileIconLetter(userName.slice(0, 1));
			//console.log(userName);
			setDisplayProfileIcon(true);

			if (
				storedUserData.data.userWithoutPassword.usertype === "owner" ||
				storedUserData.data.userWithoutPassword.usertype === "renter"
			) {
				setIsUserTypeKnown(true);
				if (storedUserData.data.userWithoutPassword.usertype === "owner") {
					setIsUserOwner(true);
				}
			}
		}
	}, []);

	const openDialogFunction = () => {
		setOpenSignUpDialog(true);
		(dialogRef.current as HTMLDialogElement | null)?.showModal();
	};

	const closeDialogFunction = () => {
		setOpenSignUpDialog(false);
		(dialogRef.current as HTMLDialogElement | null)?.close();
	};

	const LogOut = () => {
		toast.success("Logged Out");
		sessionStorage.removeItem("User");
		sessionStorage.removeItem("UserLoggedIn");
		//alert("Logged Out");
		location.reload();
		route.push("/");
	};

	return (
		<>
			<Toast />
			<nav className="border-b-1 border-fuchsia-800 py-2 lg:py-0">
				<div className="px-2">
					<div className="flex items-center justify-between">
						<Link href={"/"}>
							<Image
								src={Logo}
								alt={`Logo`}
								className={isUserOwner ? "w-8 h-8 lg:w-12 lg:h-12" : `w-10 h-10 lg:w-12 lg:h-12`}
							/>
						</Link>
						{!isUserTypeKnown ? (
							<div className="flex gap-2.5 items-center">
								<button className="border-2 bg-white border-orange-400 px-4 text-sm font-semibold text-fuchsia-800 py-1 rounded-full">
									<Link
										href={`/login`}
										// onClick={() => openDialogFunction()}
									>
										Log In
									</Link>
								</button>
								<UserCircleIcon
									className="size-10 text-fuchsia-800"
									// onClick={() => GoToPageFunction(route, "/login")}
								/>
							</div>
						) : (
							<div className="flex gap-3.5 items-center">
								<div className="flex gap-2.5 items-center">
									{/* {isUserOwner ? <h1>Owner</h1> : <h1>Renter</h1>} */}
									{!displayProfileIcon ? (
										<UserCircleIcon className="size-10" onClick={() => GoToPageFunction(route, "/")} />
									) : (
										<div className="flex items-center gap-1 lg:gap-2 cursor-pointer">
											<Link href={"/favorites"}>
												<div className="text-xs lg:text-base flex items-center gap-1">
													<HeartIcon className="size-4 lg:size-6" />
													<p>Favorites</p>
												</div>
											</Link>

											{isUserOwner && (
												<Link href={"/properties-for-owner"}>
													<div className="text-xs lg:text-base flex items-center gap-1">
														<Cog8ToothIcon className="size-4 lg:size-6" />
														<p>Properties</p>
													</div>
												</Link>
											)}
											<Link href={"/settings"}>
												<div className="text-xs lg:text-base flex items-center gap-1">
													<Cog8ToothIcon className="size-4 lg:size-6" />
													<p>Settings</p>
												</div>
											</Link>

											<div
												className="text-xs lg:text-base flex items-center gap-1"
												onClick={() => {
													LogOut();
												}}
											>
												<ArrowLeftEndOnRectangleIcon className="size-4 lg:size-6" />
												<p>Log Out</p>
											</div>

											<div className="rounded-full font-bold bg-fuchsia-800 text-custom-white-50 cursor-pointer w-7 h-7 lg:w-9 lg:h-9 flex items-center justify-center">
												<p className="text-xs lg:text-base text-center w-fit h-fit">{profileIconLetter}</p>
											</div>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
				{/* <ul
					className={`rounded-b-2xl lg:absolute right-2 lg:border-1 border-fuchsia-800 px-2 lg:w-[30%] lg:pb-2 transition-all duration-300 ease-in-out overflow-hidden ${
						isMenuOpen ? "max-h-60 opacity-100 scale-y-100" : "max-h-0 opacity-0 scale-y-95"
					} 
					transform origin-top`}
				>
					<Link href={"/favorites"}>
					</Link>
						<li className="font-semibold text-fuchsia-800 p-2 border-b-fuchsia-800 border-b-1">
							Favorites
						</li>
					{isUserOwner && (
						<Link href={"/properties-for-owner"}>
							<li className="font-semibold text-fuchsia-800 p-2 border-b-fuchsia-800 border-b-1">
								My Properties
							</li>
						</Link>
					)}
					<Link href={"/account-settings"}>
						<li className="font-semibold text-fuchsia-800 p-2 border-b-fuchsia-800 border-b-1">
							Account Settings
						</li>
					</Link>
					<button className="bg-custom-red-400 font-semibold text-custom-white-50 w-full py-2 mt-2 lg:mt-3 mb-2 lg:mb-0 rounded-full">
						Log Out
					</button>
				</ul> */}
			</nav>

			{/* sign up and log in dialog box */}
			{/* <dialog
				open={openSignUpDialog}
				ref={dialogRef}
				className="lg:w-[30%] rounded-2xl backdrop:bg-fuchsia-800/15 animate-fade"
			>
				<XCircleIcon
					className="size-8 absolute top-0 right-0 text-orange-400 hover:text-red-500 cursor-pointer transition-all ease-in-out duration-300"
					onClick={() => {
						closeDialogFunction();
					}}
				/>
				<SignUpRenter />
			</dialog> */}
		</>
	);
}

// <h1
// 	className="rounded-full text-center px-3 py-1 text-lg font-bold bg-fuchsia-800 text-custom-white-50 cursor-pointer"
// 	onClick={() => setIsMenuOpen(!isMenuOpen)}
// >
// 	{isMenuOpen ? <XCircleIcon className="size-10" /> : `${profileIconLetter}`}
// </h1>
