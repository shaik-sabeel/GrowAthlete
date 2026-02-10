// // utils/mailer.js
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendWelcomeEmail = async (toEmail, name) => {
//   try {
//     await transporter.sendMail({
//       from: `"MyApp" <${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject: "🎉 Welcome to MyApp!",
//       html: `<h3>Hi ${name},</h3><p>Thanks for registering! Welcome aboard 🎉</p>`,
//     });
//     console.log("✅ Welcome email sent to", toEmail);
//   } catch (error) {
//     console.error("❌ Failed to send email:", error);
//   }
// };

// module.exports = sendWelcomeEmail;
// const logo = require("../assets/galogo.png");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (toEmail, name) => {
  try {
    const mailOptions = {
      from: `"GrowAthlete" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "🎉Welcome to GrowAthlete!",
      html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Welcome to GrowAthlete</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial, Helvetica, sans-serif;color:#333;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:24px auto;border-collapse:collapse;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(20,30,50,0.08);">
          <tr>
            <td style="padding:28px 28px 18px;background:linear-gradient(90deg,#0b63b8 0%,#1ea37a 100%);color:#fff;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                 
                  <td align="right" style="vertical-align:middle;color:#ffffff;font-size:14px;">
                    <strong style="font-size:16px;letter-spacing:0.3px;">Welcome to GrowAthlete</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 28px 8px;">
              <h1 style="margin:0 0 10px;font-size:22px;color:#0b2b4a;">Hi ${name},</h1>
              <p style="margin:0;color:#5b6b7a;font-size:15px;line-height:1.5;">Thanks for joining <strong>GrowAthlete</strong> — your new training ally. You’ve just taken the first step toward improving performance, tracking progress, and connecting with a community that pushes you to be better every day.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 28px 4px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:top;padding-right:8px;width:56px;">
                    <div style="width:48px;height:48px;border-radius:10px;background:#ffe9de;display:flex;align-items:center;justify-content:center;font-size:20px;color:#ff6b35;">🏅</div>
                  </td>
                  <td style="vertical-align:top;padding-left:4px;">
                    <strong style="display:block;font-size:15px;color:#0b2b4a;">Expert tips & training plans</strong>
                    <span style="display:block;color:#5b6b7a;font-size:14px;">Proven drills and routines tailored to your sport.</span>
                  </td>
                </tr>
                <tr style="height:14px;"></tr>
                <tr>
                  <td style="vertical-align:top;padding-right:8px;width:56px;">
                    <div style="width:48px;height:48px;border-radius:10px;background:#e9fff2;display:flex;align-items:center;justify-content:center;font-size:20px;color:#12a65a;">🤝</div>
                  </td>
                  <td style="vertical-align:top;padding-left:4px;">
                    <strong style="display:block;font-size:15px;color:#0b2b4a;">A motivating community</strong>
                    <span style="display:block;color:#5b6b7a;font-size:14px;">Connect, challenge, and celebrate wins together.</span>
                  </td>
                </tr>
                <tr style="height:14px;"></tr>
                <tr>
                  <td style="vertical-align:top;padding-right:8px;width:56px;">
                    <div style="width:48px;height:48px;border-radius:10px;background:#eef6ff;display:flex;align-items:center;justify-content:center;font-size:20px;color:#0b63b8;">📊</div>
                  </td>
                  <td style="vertical-align:top;padding-left:4px;">
                    <strong style="display:block;font-size:15px;color:#0b2b4a;">Track progress</strong>
                    <span style="display:block;color:#5b6b7a;font-size:14px;">Visualize improvements with easy-to-read analytics.</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="padding:0 28px 22px;">
              <div style="background:#fafafa;border-radius:8px;padding:12px;border:1px solid #eef1f4;">
                <strong style="display:block;margin-bottom:6px;color:#0b2b4a;">Quick tips to get the most out of GrowAthlete</strong>
                <ul style="margin:0;padding-left:18px;color:#5b6b7a;font-size:14px;line-height:1.5;">
                  <li>Complete your profile — it helps us personalize your plan.</li>
                  <li>Set a short 7-day goal to start seeing momentum.</li>
                  <li>Join one community challenge this month to meet fellow athletes.</li>
                </ul>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px 28px;color:#8b98a6;font-size:13px;">
              <p style="margin:0 0 8px;">If you need help, reply to this email or visit our <a href="growahlete8@gmail.com" style="color:#0b63b8;">Help Center</a>.</p>
              <p style="margin:0;">Stay focused,<br><strong>The GrowAthlete Team</strong></p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
                
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    };
    await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent to", toEmail);
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
  }
};

const sendTournamentRegistrationEmail = async (toEmail, name, tournament) => {
  try {
    const mailOptions = {
      from: `"GrowAthlete Event Team" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Registration Confirmed: ${tournament.title}`,
      html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Tournament Registration Confirmed</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial, Helvetica, sans-serif;color:#333;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:24px auto;border-collapse:collapse;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(20,30,50,0.08);">
          {/* Header */}
          <tr>
            <td style="padding:28px 28px 18px;background:linear-gradient(90deg,#4f46e5 0%,#7c3aed 100%);color:#fff;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="vertical-align:middle;">
                    <h2 style="margin:0;font-size:20px;font-weight:bold;color:#ffffff;">Registration Confirmed! 🏆</h2>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          {/* Body */}
          <tr>
            <td style="padding:32px 28px;">
              <h1 style="margin:0 0 16px;font-size:24px;color:#1e293b;">Hello ${name},</h1>
              <p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6;">
                You have successfully registered for <strong>${tournament.title}</strong>! We are excited to see you compete.
              </p>
              
              <div style="background-color:#f8fafc;border-radius:8px;padding:20px;border:1px solid #e2e8f0;margin-bottom:24px;">
                <h3 style="margin:0 0 16px;font-size:18px;color:#334155;border-bottom:1px solid #e2e8f0;padding-bottom:12px;">Tournament Details</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:12px;color:#64748b;font-size:14px;width:100px;">Sport:</td>
                    <td style="padding-bottom:12px;color:#1e293b;font-size:15px;font-weight:600;">${tournament.sport}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:12px;color:#64748b;font-size:14px;">Location:</td>
                    <td style="padding-bottom:12px;color:#1e293b;font-size:15px;font-weight:600;">${tournament.location}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:12px;color:#64748b;font-size:14px;">Date:</td>
                    <td style="padding-bottom:12px;color:#1e293b;font-size:15px;font-weight:600;">${tournament.dateRange}</td>
                  </tr>
                  <tr>
                    <td style="color:#64748b;font-size:14px;">Fee:</td>
                    <td style="color:#1e293b;font-size:15px;font-weight:600;">$${tournament.entryFee}</td>
                  </tr>
                </table>
              </div>

              <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
                <strong>Next Steps:</strong> Check your dashboard for any updates or schedule changes. Make sure to arrive at the venue at least 30 minutes before your scheduled start time.
              </p>
              
              <div style="text-align:center;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" style="display:inline-block;padding:12px 24px;background-color:#4f46e5;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">Go to Dashboard</a>
              </div>
            </td>
          </tr>
          
          {/* Footer */}
          <tr>
            <td style="padding:24px;background-color:#f1f5f9;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:13px;">
                GrowAthlete Inc.<br>
                Empowering athletes everywhere.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Tournament registration email sent to", toEmail);
  } catch (error) {
    console.error("❌ Failed to send tournament email:", error);
  }
};

module.exports = { sendWelcomeEmail, sendTournamentRegistrationEmail };