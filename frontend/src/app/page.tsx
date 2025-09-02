"use client";
import Link from "next/link";

export default function Home() {
	return (
		<div className="flex gap-3.5">
			<button>
				<Link href={`/signupRenter `}>Renter Sign Up</Link>
			</button>
			<button>
				<Link href={`/signupOwner`}>Owner Sign Up</Link>
			</button>
			<button>
				<Link href={`/loginRenter `}>Renter Log In</Link>
			</button>
			<button>
				<Link href={`/loginOwner`}>Owner Log In</Link>
			</button>
		</div>
	);
}
