"use client";
import Link from "next/link";

export default function Home() {
	return (
		<div className="flex gap-3.5">
			<button>
				<Link href={`/sign-up-renter `}>Renter Sign Up</Link>
			</button>
			<button>
				<Link href={`/sign-up-owner`}>Owner Sign Up</Link>
			</button>
			<button>
				<Link href={`/login-renter `}>Renter Log In</Link>
			</button>
			<button>
				<Link href={`/login-owner`}>Owner Log In</Link>
			</button>
		</div>
	);
}
