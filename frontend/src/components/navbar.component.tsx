"use client";

import Link from "next/link";
import {
	UserCircleIcon,
	Cog8ToothIcon,
	ArrowLeftEndOnRectangleIcon,
	BookmarkIcon,
	HomeModernIcon,
} from "@heroicons/react/24/outline";
import { GoToPageFunction } from "@/app/functions/gotoLogin.function";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "../../public/assets/logo.svg";
import Image from "next/image";

import Toast from "@/components/toast.component";
import { toast } from "react-toastify";

export default function NavBar() {
	const route = useRouter();

	const [displayProfileIcon, setDisplayProfileIcon] = useState<boolean>(false);
	const [profileIconLetter, setProfileIconLetter] = useState<string>("");
	const [isUserTypeKnown, setIsUserTypeKnown] = useState<boolean>(false);
	const [isUserOwner, setIsUserOwner] = useState<boolean>(false);

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

	const LogOut = () => {
		toast.success("Logged Out");
		sessionStorage.removeItem("User");
		sessionStorage.removeItem("UserLoggedIn");

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
									<Link href={`/login`}>Log In</Link>
								</button>
								<UserCircleIcon className="size-10 text-fuchsia-800" />
							</div>
						) : (
							<div className="flex gap-3.5 items-center">
								<div className="flex gap-2.5 items-center">
									{!displayProfileIcon ? (
										<UserCircleIcon className="size-10" onClick={() => GoToPageFunction(route, "/")} />
									) : (
										<div className="flex items-center gap-1 lg:gap-2 cursor-pointer">
											<Link href={"/favorites"}>
												<p className="text-xs lg:text-sm font-semibold flex items-center hover:text-fuchsia-800 transition-all duration-300 ease-in-out gap-1">
													Saved
													<span>
														<BookmarkIcon className="size-4 stroke-2" />
													</span>
												</p>
											</Link>

											{isUserOwner && (
												<Link href={"/properties-for-owner"}>
													<p className="text-xs lg:text-sm font-semibold flex items-center hover:text-fuchsia-800 transition-all duration-300 ease-in-out gap-1">
														Dashboard
														<span>
															<HomeModernIcon className="size-4 stroke-2" />
														</span>
													</p>
												</Link>
											)}
											<Link href={"/settings"}>
												<p className="text-xs lg:text-sm font-semibold flex items-center hover:text-fuchsia-800 transition-all duration-300 ease-in-out gap-1">
													Settings
													<span>
														<Cog8ToothIcon className="size-4 stroke-2" />
													</span>
												</p>
											</Link>

											<div
												className="text-xs lg:text-base flex items-center gap-1"
												onClick={() => {
													LogOut();
												}}>
												<p className="text-xs lg:text-sm font-semibold flex items-center hover:text-fuchsia-800 transition-all duration-300 ease-in-out">
													Log Out
													<span>
														<ArrowLeftEndOnRectangleIcon className="size-4 stroke-2" />
													</span>
												</p>
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
			</nav>
		</>
	);
}
