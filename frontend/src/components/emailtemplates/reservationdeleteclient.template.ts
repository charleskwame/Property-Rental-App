export const ReservationDeleteClient = (
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
	<title>Viewing Cancelled</title>
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
			<h1>✗ Viewing Cancelled</h1>
		</div>
		
		<div class="content">
			<div class="greeting">
				Hi <strong>${username}</strong>,
			</div>
			
			<p class="info-text">
				Your viewing request for <strong>${propertyname}</strong> has been cancelled. Below are the details of the cancelled viewing:
			</p>
			
			<div class="details-box">
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
				<strong>📝 Next Steps</strong><br>
				If you'd like to reschedule or view another property, please visit our platform and submit a new viewing request. We look forward to helping you find the perfect property!
			</div>
			
			<p class="info-text">
				If you have any questions, please don't hesitate to contact us through the platform or reply to this email.
			</p>
		</div>
		
		<div class="divider"></div>
		
		<div class="footer">
			<div class="footer-text"><strong>Property Rental App</strong></div>
			<div class="footer-text">Your trusted property rental platform</div>
			<div class="footer-text" style="margin-top: 15px; font-style: italic;">© 2025 Property Rental App. All rights reserved.</div>
		</div>
	</div>
</body>
</html>`;
};
