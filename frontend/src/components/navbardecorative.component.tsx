"use client";

import Logo from "../../public/assets/logo.svg";
import Image from "next/image";

export default function NavBarDecorative() {
	return (
		<>
			<nav className="border-b-1 border-fuchsia-800 py-2 lg:py-0">
				<div className="px-2">
					<div className="flex items-center justify-between">
						<Image src={Logo} alt={`Logo`} className={`w-10 h-10 lg:w-12 lg:h-12`} />
					</div>
				</div>
			</nav>
		</>
	);
}
