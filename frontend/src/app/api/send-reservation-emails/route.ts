// import { otpEmailTemplate } from "@/components/emailtemplates/otpverification.template";
import { ReservationEmailClient } from "@/components/emailtemplates/reservationemailclient.template";
import { ReservationEmailOwner } from "@/components/emailtemplates/reservationemailowner.template";
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

		const ClientReservationEmailTemplate = ReservationEmailClient(
			body.username,
			body.propertyname,
			body.date,
			body.time,
		);
		const OwnerReservationEmailTemplate = ReservationEmailOwner(
			body.username,
			body.ownername,
			body.propertyname,
			body.date,
			body.time,
		);

		const messagetoclient = {
			from: "charlestettehnull@gmail.com",
			to: body.clientemail,
			subject: "Your reservation has been sent!",
			html: ClientReservationEmailTemplate,
			headers: {
				"X-Entity-Ref-ID": "newmail",
			},
		};

		const messagetoowner = {
			from: "charlestettehnull@gmail.com",
			to: body.owneremail,
			subject: "You have a new reservation!",
			html: OwnerReservationEmailTemplate,
			headers: {
				"X-Entity-Ref-ID": "newmail",
			},
		};

		await transporter.sendMail(messagetoclient);
		await transporter.sendMail(messagetoowner);

		return NextResponse.json({ message: "Email sent" }, { status: 200 });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
	}
}
