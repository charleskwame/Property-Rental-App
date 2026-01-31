export const ReservationDeleteOwner = (
	ownername: string,
	username: string,
	propertyname: string,
	date: string,
	time: string,
) => {
	return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Reservation Deleted</title>
      
      <style type="text/css">
        @media only screen and (min-width: 720px) {
          .u-row { width: 700px !important; }
          .u-row .u-col { vertical-align: top; }
          .u-row .u-col-100 { width: 700px !important; }
        }
        @media only screen and (max-width: 720px) {
          .u-row-container { max-width: 100% !important; padding-left: 0px !important; padding-right: 0px !important; }
          .u-row { width: 100% !important; }
          .u-row .u-col { min-width: 320px !important; max-width: 100% !important; display: block !important; }
          .u-row .u-col > div { margin: 0 auto; }
        }
        body { margin: 0; padding: 0; }
        table, tr, td { vertical-align: top; border-collapse: collapse; }
        p { margin: 0; }
      </style>
    </head>
    
    <body class="clean-body u_body" style="margin: 0;padding: 0;background-color: #f9f9f9;">
      <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
      <tbody>
      <tr style="vertical-align: top">
        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
        
        <div class="u-row-container" style="padding: 40px 10px 0px;background-color: transparent">
          <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 700px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              
              <div class="u-col u-col-100" style="max-width: 320px;min-width: 700px;display: table-cell;vertical-align: top;">
                <div style="height: 100%;width: 100% !important;">
                  <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                    
                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                      <tbody>
                        <tr>
                          <td style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 20px;font-family:arial,helvetica,sans-serif;" align="left">
                            <h1 style="margin: 0px; color: #c026d3; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 28px; font-weight: 700;">
                              <span>Reservation Deleted</span>
                            </h1>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                      <tbody>
                        <tr>
                          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 40px;font-family:arial,helvetica,sans-serif;" align="left">
                            <div style="font-size: 14px; line-height: 160%; text-align: left; word-wrap: break-word;">
                              <p style="line-height: 160%;">Hi <strong>${ownername}</strong>,</p>
                              <p style="line-height: 160%;">&nbsp;</p>
                              <p style="line-height: 160%;">This is a confirmation that you have successfully <strong style="color: #dc2626;">deleted</strong> the reservation for your property.</p>
                              <p style="line-height: 160%;">&nbsp;</p>
                              <p style="line-height: 160%;"><strong>Deleted Reservation Details:</strong></p>
                              <ul style="line-height: 160%;">
                                <li><strong>Property:</strong> ${propertyname}</li>
                                <li><strong>Renter:</strong> ${username}</li>
                                <li><strong>Date:</strong> ${date}</li>
                                <li><strong>Time:</strong> ${time}</li>
                              </ul>
                              <p style="line-height: 160%;">&nbsp;</p>
                              <p style="line-height: 160%;">The renter has been notified via email about the cancellation.</p>
                              <p style="line-height: 160%;">&nbsp;</p>
                              <p style="line-height: 160%;">This time slot is now available for new reservations.</p>
                              <p style="line-height: 160%;">&nbsp;</p>
                              <p style="line-height: 160%;">Best regards,<br /><strong>Property Rental Team</strong></p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
        
        <div class="u-row-container" style="padding: 0px 10px 40px;background-color: transparent">
          <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 700px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f3e8ff;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              
              <div class="u-col u-col-100" style="max-width: 320px;min-width: 700px;display: table-cell;vertical-align: top;">
                <div style="height: 100%;width: 100% !important;">
                  <div style="box-sizing: border-box; height: 100%; padding: 20px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                    
                    <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                      <tbody>
                        <tr>
                          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                            <div style="font-size: 12px; color: #7c3aed; line-height: 140%; text-align: center; word-wrap: break-word;">
                              <p style="line-height: 140%;">© 2026 Property Rental App. All rights reserved.</p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
        
        </td>
      </tr>
      </tbody>
      </table>
    </body>
    </html>`;
};
