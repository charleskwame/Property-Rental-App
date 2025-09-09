"use client";

import Link from "next/link";
import { H1Icon, UserCircleIcon } from "@heroicons/react/24/outline";
import { GoToPageFunction } from "@/app/functions/gotoLogin.function";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavBar() {
	const route = useRouter();
	const [displayProfileIcon, setDisplayProfileIcon] = useState<boolean>(false);
	const [profileIconLetter, setProfileIconLetter] = useState<string>("");
	useEffect(() => {
		if (
			JSON.parse(`${localStorage.getItem("Renter")}`) !== null &&
			sessionStorage.getItem("RenterLogInStatus") !== null &&
			JSON.parse(`${sessionStorage.getItem("RenterLogInStatus")}`).loggedin === true
		) {
			const unParsedRenterData = localStorage.getItem("Renter");
			const storedRenterData = JSON.parse(unParsedRenterData!);
			const userName: string = storedRenterData.data.renterWithoutPassword.name;
			setProfileIconLetter(userName.slice(0, 1));
			console.log(userName);
			setDisplayProfileIcon(true);
		}
	}, []);
	return (
		<nav className="flex gap-3.5 mb-5">
			<button>
				<Link href={`/sign-up-owner`}>Rent out your property</Link>
			</button>
			{!displayProfileIcon ? (
				<UserCircleIcon className="size-10" onClick={() => GoToPageFunction(route, "/login-renter")} />
			) : (
				<h1 className="border-2 rounded-full border-black text-center px-3 py-1 text-xl">
					{profileIconLetter}
				</h1>
			)}
		</nav>
	);
}
