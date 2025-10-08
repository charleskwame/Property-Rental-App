// import { otpEmailTemplate } from "@/components/emailtemplates/otpverification.template";
// import { NextResponse } from "next/server";

// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
// 	service: "gmail",
// 	auth: {
// 		user: process.env.NODEMAILER_EMAIL,
// 		pass: process.env.NODEMAILER_PASSWORD,
// 	},
// });

// export async function POST(request: Request) {
// 	try {
// 		const body = await request.json();
// 		console.log(body);
// 		return true;
// 		const OTPEmailTemplate = otpEmailTemplate(body.otpCode, body.userName);
// 		const message = {
// 			from: "charlestettehnull@gmail.com",
// 			to: body.email,
// 			subject: "Testing in next js",
// 			html: `<h1>Working otp email</h1>`,
// 			headers: {
// 				"X-Entity-Ref-ID": "newmail",
// 			},
// 		};
// 		await transporter.sendMail(message);
// 		return NextResponse.json({ message: "Email sent" }, { status: 200 });
// 	} catch (error) {
// 		return NextResponse.json({ error }, { status: 500 });
// 	}
// }

import { otpEmailTemplate } from "@/components/emailtemplates/otpverification.template";
import { verificationSuccessTemplate } from "@/components/emailtemplates/verificationsuccess.template";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.NODEMAILER_EMAIL,
		pass: process.env.NODEMAILER_PASSWORD,
	},
});

export async function POST(request: Request) {
	try {
		const body = await request.json();
		// // return { body };
		// // console.log(request);
		// // console.log(request);
		// console.log(body);
		const VerificationEmailTemplate = verificationSuccessTemplate(body.userName);

		const message = {
			from: "charlestettehnull@gmail.com",
			to: body.email,
			subject: "Testing in Next.js",
			html: VerificationEmailTemplate,
			headers: {
				"X-Entity-Ref-ID": "newmail",
			},
		};

		await transporter.sendMail(message);

		return NextResponse.json({ message: "Email sent" }, { status: 200 });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
	}
}
