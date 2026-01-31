import { ReservationDeleteClient } from "@/components/emailtemplates/reservationdeleteclient.template";
import { ReservationDeleteOwner } from "@/components/emailtemplates/reservationdeleteowner.template";
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

		const ClientDeleteEmail = ReservationDeleteClient(
			body.username,
			body.propertyname,
			body.date,
			body.time,
		);

		const OwnerDeleteEmail = ReservationDeleteOwner(
			body.ownername,
			body.username,
			body.propertyname,
			body.date,
			body.time,
		);

		const messagetoclient = {
			from: "charlestettehnull@gmail.com",
			to: body.clientemail,
			subject: "Reservation Cancelled",
			html: ClientDeleteEmail,
			headers: {
				"X-Entity-Ref-ID": "newmail",
			},
		};

		const messagetoowner = {
			from: "charlestettehnull@gmail.com",
			to: body.owneremail,
			subject: "Reservation Deleted - Confirmation",
			html: OwnerDeleteEmail,
			headers: {
				"X-Entity-Ref-ID": "newmail",
			},
		};

		await transporter.sendMail(messagetoclient);
		await transporter.sendMail(messagetoowner);

		return NextResponse.json({ message: "Emails sent successfully" });
	} catch (error) {
		console.error("Error sending emails:", error);
		return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
	}
}
