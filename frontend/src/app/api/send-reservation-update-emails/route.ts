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
			subject: "Your reservation has an update!",
			html: ClientReservationEmailUpdateAccepted,
			headers: {
				"X-Entity-Ref-ID": "newmail",
			},
		};

		const messagetoclientrejected = {
			from: "charlestettehnull@gmail.com",
			to: body.clientemail,
			subject: "Your reservation has an update!",
			html: ClientReservationEmailUpdateRejected,
			headers: {
				"X-Entity-Ref-ID": "newmail",
			},
		};

		const messagetoownerupdate = {
			from: "charlestettehnull@gmail.com",
			to: body.owneremail,
			subject: "You have taken action on a reservation!",
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
