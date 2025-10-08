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

		const VerificationEmailTemplate = verificationSuccessTemplate(body.userName);

		const message = {
			from: "charlestettehnull@gmail.com",
			to: body.email,
			subject: "Verify your rent easy email!",
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
