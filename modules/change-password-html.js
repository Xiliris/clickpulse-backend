module.exports = (resetLink, frontendURL) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="x-apple-disable-message-reformatting" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <style type="text/css">
            /* CSS Styles Here */
          </style>
          <link href="https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap" rel="stylesheet" type="text/css" />
        </head>
        <body class="clean-body u_body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #252a34; color: #000000;">
          <table id="u_body" cellpadding="0" cellspacing="0" width="100%" align="center" style="background-color: #252a34;">
            <tbody>
              <tr>
                <td>
                  <div class="u-row-container" style="padding: 0; background-color: transparent;">
                    <div class="u-row" style="max-width: 600px; background-color: #ffffff; margin: 0 auto;">
                      <div style="border-collapse: collapse; display: table; width: 100%; background-color: #ffffff;">
                        <div class="u-col u-col-100" style="display: table-cell; vertical-align: top;">
                          <div style="background-color: #ffffff; width: 100%; border-radius: 0;">
                            <table style="font-family: 'Raleway', sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%">
                              <tbody>
                                <tr>
                                  <td align="center" style="padding: 20px 40px; font-family: 'Raleway', sans-serif; text-align: center;">
                                    <h1 style="margin: 0; color: #252a34; text-align: center; font-size: 24px; font-weight: 700;">
                                      Password Reset Request
                                    </h1>
                                    <p style="font-size: 16px; color: #555555; text-align: center;">
                                      We received a request to reset your password. Click the button below to reset it.
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center" style="padding: 20px;">
                                    <a href="${frontendURL}/reset/${resetLink}" style="text-decoration: none; background-color: #3cbab1; padding: 10px 20px; color: #ffffff; border-radius: 5px; font-family: 'Raleway', sans-serif; font-size: 16px;">
                                      Reset Password
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center" style="padding: 20px;">
                                    <p style="font-size: 14px; color: #999999; text-align: center;">
                                      If you didn’t request a password reset, you can ignore this email.
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center" style="padding: 20px;">
                                    <p style="font-size: 12px; color: #a3b8c7;">
                                      &copy; 2024 Clickpulse. All Rights Reserved.
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
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
