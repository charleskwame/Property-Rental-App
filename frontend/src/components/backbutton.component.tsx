"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function BackButton() {
	const router = useRouter();
	const pathname = usePathname();

	const handleBack = () => {
		router.back();
	};

	// Don't show the back button on the main page
	if (pathname === "/") {
		return null;
	}

	return (
		<button
			onClick={handleBack}
			className="flex items-center gap-1 text-fuchsia-800 hover:text-fuchsia-900 transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-fuchsia-50 group border border-fuchsia-800/20 cursor-pointer">
			<ArrowLeftIcon className="size-3 group-hover:-translate-x-1 transition-transform duration-200" />
			<span className="text-sm font-semibold">Back</span>
		</button>
	);
}
