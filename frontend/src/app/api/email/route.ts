import { EmailTemplate } from "@/components/emails/email-template";
// import { headers } from "next/headers";
import { NextResponse } from "next/server";
// import { Resend } from "resend";

export const runtime = "edge";

// const resend = new Resend(process.env.RESEND_API_KEY);

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "charlestettehnull@gmail.com",
		pass: "kptsofrmrgnkmclc",
	},
});

export async function POST() {
	try {
		// const body = await request.json();

		const message = {
			from: "charlestettehnull@gmail.com",
			to: "quamheberri67@gmail.com",
			subject: "Testing in next js",
			html: `<p>This is a test</p>`,
			headers: {
				"X-Entity-Ref-ID": "newmail",
			},
		};
		await transporter.sendMail(message);
		return NextResponse.json({ message: "Email sent" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// try {
// 	const { data, error } = await resend.emails.send({
// 		from: "charlestettehnull@gmail.com",
// 		to: ["quamheberri67@gmail.com"],
// 		subject: "Hello world",
// 		react: EmailTemplate({ firstName: "Charles" }),
// 	});
// 	if (error) {
// 		return Response.json({ error }, { status: 500 });
// 	}
// 	return Response.json(data);
// } catch (error) {
// 	return Response.json({ error }, { status: 500 });
// }
