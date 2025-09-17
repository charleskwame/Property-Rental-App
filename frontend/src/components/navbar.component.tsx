"use client";

import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { GoToPageFunction } from "@/app/functions/gotoLogin.function";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
	return (
		<nav className="">
			{!isUserTypeKnown ? (
				<div className="flex gap-3.5 mb-5">
					<button>
						<Link href={`/sign-up`}>Rent out your property</Link>
					</button>
					<UserCircleIcon className="size-10" onClick={() => GoToPageFunction(route, "/login")} />
				</div>
			) : (
				<div>
					<div className="flex gap-3.5 mb-5">
						{isUserOwner ? <h1>Owner</h1> : <h1>Renter</h1>}
						{!displayProfileIcon ? (
							<UserCircleIcon className="size-10" onClick={() => GoToPageFunction(route, "/")} />
						) : (
							<h1 className="border-2 rounded-full border-black text-center px-3 py-1 text-xl">
								{profileIconLetter}
							</h1>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}
