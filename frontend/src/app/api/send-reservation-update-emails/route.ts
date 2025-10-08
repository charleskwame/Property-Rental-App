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

// import { otpEmailTemplate } from "@/components/emailtemplates/otpverification.template";
import { ReservationEmailClient } from "@/components/emailtemplates/reservationemailclient.template";
import { ReservationEmailOwner } from "@/components/emailtemplates/reservationemailowner.template";
import {
	ReservationUpdateClientAccepted,
	ReservationUpdateClientRejected,
} from "@/components/emailtemplates/reservationupdateclient.template";
import { ReservationUpdateOwner } from "@/components/emailtemplates/reservationupdateowner.template";
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
		const ClientReservationEmailUpdateAccepted = ReservationUpdateClientAccepted(
			body.username,
			// body.ownername,
			body.propertyname,
			body.date,
			body.time,
		);

		const ClientReservationEmailUpdateRejected = ReservationUpdateClientRejected(
			body.username,
			body.propertyname,
		);

		const OwnerReservationEmailUpdate = ReservationUpdateOwner(
			body.ownername,
			body.status,
			body.username,
			body.propertyname,
			body.date,
			body.time,
		);

		const messagetoclientaccepted = {
			from: "charlestettehnull@gmail.com",
			to: body.clientemail,
			subject: "Testing in Next.js",
			html: ClientReservationEmailUpdateAccepted,
			headers: {
				"X-Entity-Ref-ID": "newmail",
			},
		};

		const messagetoclientrejected = {
			from: "charlestettehnull@gmail.com",
			to: body.clientemail,
			subject: "Testing in Next.js",
			html: ClientReservationEmailUpdateRejected,
			headers: {
				"X-Entity-Ref-ID": "newmail",
			},
		};

		const messagetoownerupdate = {
			from: "charlestettehnull@gmail.com",
			to: body.owneremail,
			subject: "Testing in Next.js",
			html: OwnerReservationEmailUpdate,
			headers: {
				"X-Entity-Ref-ID": "newmail",
			},
		};

		if (body.status === "accepted") {
			await transporter.sendMail(messagetoclientaccepted);
		} else {
			await transporter.sendMail(messagetoclientrejected);
		}
		await transporter.sendMail(messagetoownerupdate);

		return NextResponse.json({ message: "Email sent" }, { status: 200 });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
	}
}
