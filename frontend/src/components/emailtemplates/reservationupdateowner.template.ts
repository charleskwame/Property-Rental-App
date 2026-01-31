export const ReservationUpdateOwner = (
	ownername: string,
	username: string,
	propertyname: string,
	date: string,
	time: string,
) => {
	return `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Viewing Confirmed</title>
	<style>
		body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
		.container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
		.header { background: linear-gradient(135deg, #27ae60 0%, #229954 100%); color: white; padding: 40px 20px; text-align: center; }
		.header h1 { margin: 0; font-size: 28px; font-weight: 700; }
		.content { padding: 40px 20px; }
		.greeting { font-size: 18px; color: #2c3e50; margin-bottom: 20px; }
		.details-box { background: #f0fdf4; border-left: 4px solid #27ae60; padding: 20px; margin: 25px 0; border-radius: 4px; }
		.detail-row { display: flex; justify-content: space-between; margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #d1fae5; }
		.detail-row:last-child { border-bottom: none; }
		.detail-label { font-weight: 600; color: #666; }
		.detail-value { color: #27ae60; font-weight: 700; }
		.info-text { color: #666; font-size: 14px; margin: 20px 0; line-height: 1.8; }
		.action-text { background: #e8f5e9; border: 1px solid #c8e6c9; padding: 15px; border-radius: 4px; color: #2e7d32; font-size: 14px; margin: 20px 0; }
		.footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #e0e0e0; }
		.footer-text { margin: 5px 0; }
		.divider { height: 1px; background: #e0e0e0; margin: 30px 0; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>✓ Viewing Confirmed!</h1>
		</div>
		
		<div class="content">
			<div class="greeting">
				Hi <strong>${ownername}</strong>,
			</div>
			
			<p class="info-text">
				This is a confirmation that you have <strong>approved</strong> the viewing request from <strong>${username}</strong>. The viewing is now confirmed for:
			</p>
			
			<div class="details-box">
				<div class="detail-row">
					<span class="detail-label">Renter Name:</span>
					<span class="detail-value">${username}</span>
				</div>
				<div class="detail-row">
					<span class="detail-label">Property:</span>
					<span class="detail-value">${propertyname}</span>
				</div>
				<div class="detail-row">
					<span class="detail-label">Date:</span>
					<span class="detail-value">${date}</span>
				</div>
				<div class="detail-row">
					<span class="detail-label">Time:</span>
					<span class="detail-value">${time}</span>
				</div>
			</div>
			
			<div class="action-text">
				<strong>📞 Renter Notification</strong><br>
				The renter has been notified of your approval. Please make sure your property is ready for the viewing at the agreed time.
			</div>
			
			<p class="info-text">
				Thank you for using Property Rental App. If you need to reschedule or cancel this viewing, please do so through your account dashboard as soon as possible.
			</p>
		</div>
		
		<div class="divider"></div>
		
		<div class="footer">
			<div class="footer-text"><strong>Property Rental App</strong></div>
			<div class="footer-text">Empowering property owners</div>
			<div class="footer-text" style="margin-top: 15px; font-style: italic;">© 2025 Property Rental App. All rights reserved.</div>
		</div>
	</div>
</body>
</html>`;
};

export const ReservationUpdateOwnerRejected = (
	ownername: string,
	username: string,
	propertyname: string,
	date: string,
	time: string,
) => {
	return `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Viewing Request Declined</title>
	<style>
		body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
		.container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
		.header { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 40px 20px; text-align: center; }
		.header h1 { margin: 0; font-size: 28px; font-weight: 700; }
		.content { padding: 40px 20px; }
		.greeting { font-size: 18px; color: #2c3e50; margin-bottom: 20px; }
		.details-box { background: #fef5f5; border-left: 4px solid #e74c3c; padding: 20px; margin: 25px 0; border-radius: 4px; }
		.detail-row { display: flex; justify-content: space-between; margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #ffe0e0; }
		.detail-row:last-child { border-bottom: none; }
		.detail-label { font-weight: 600; color: #666; }
		.detail-value { color: #e74c3c; font-weight: 700; }
		.info-text { color: #666; font-size: 14px; margin: 20px 0; line-height: 1.8; }
		.action-text { background: #f3e5f5; border: 1px solid #e1bee7; padding: 15px; border-radius: 4px; color: #6a1b9a; font-size: 14px; margin: 20px 0; }
		.footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #e0e0e0; }
		.footer-text { margin: 5px 0; }
		.divider { height: 1px; background: #e0e0e0; margin: 30px 0; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>✗ Viewing Request Declined</h1>
		</div>
		
		<div class="content">
			<div class="greeting">
				Hi <strong>${ownername}</strong>,
			</div>
			
			<p class="info-text">
				This is a confirmation that you have <strong>declined</strong> the viewing request from <strong>${username}</strong> for <strong>${propertyname}</strong>. Here are the details:
			</p>
			
			<div class="details-box">
				<div class="detail-row">
					<span class="detail-label">Renter Name:</span>
					<span class="detail-value">${username}</span>
				</div>
				<div class="detail-row">
					<span class="detail-label">Property:</span>
					<span class="detail-value">${propertyname}</span>
				</div>
				<div class="detail-row">
					<span class="detail-label">Requested Date:</span>
					<span class="detail-value">${date}</span>
				</div>
				<div class="detail-row">
					<span class="detail-label">Requested Time:</span>
					<span class="detail-value">${time}</span>
				</div>
			</div>
			
			<div class="action-text">
				<strong>📌 Renter Notification</strong><br>
				The renter has been notified that this time slot is not available. They can submit viewing requests for other times if interested.
			</div>
			
			<p class="info-text">
				Thank you for using Property Rental App to manage your property. You can continue managing viewing requests from your dashboard.
			</p>
		</div>
		
		<div class="divider"></div>
		
		<div class="footer">
			<div class="footer-text"><strong>Property Rental App</strong></div>
			<div class="footer-text">Empowering property owners</div>
			<div class="footer-text" style="margin-top: 15px; font-style: italic;">© 2025 Property Rental App. All rights reserved.</div>
		</div>
	</div>
</body>
</html>`;
};
