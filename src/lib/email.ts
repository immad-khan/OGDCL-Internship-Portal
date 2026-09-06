import nodemailer from "nodemailer";

/** Build the reusable transporter once per process. */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST ?? "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT ?? 465),
    secure: true, // SSL — must be true for port 465
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD,
    },
  });
}

const fromName = process.env.EMAIL_FROM_NAME ?? "OGDCL Intern System";
const fromAddress = process.env.EMAIL_HOST_USER ?? "";
const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

/** Sends the welcome / credential email to a newly-created intern.
 *  Throws if the send fails (caller should handle / rollback). */
export async function sendInternWelcomeEmail(
  to: string,
  name: string,
  password: string,
): Promise<void> {
  const transporter = createTransporter();
  const loginUrl = `${appUrl}/login?role=intern`;
  const firstName = name.split(" ")[0] ?? name;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your OGDCL Intern Portal credentials</title>
</head>
<body style="margin:0;padding:0;background:#0f1117;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#e2e8f0;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#0f1117;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#16181f;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">

          <!-- Header band -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d9488 0%,#14b8a6 100%);padding:32px 40px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(0,0,0,0.5);">
                Oil &amp; Gas Development Company Limited
              </p>
              <h1 style="margin:10px 0 0;font-size:26px;font-weight:700;color:#fff;letter-spacing:-0.3px;">
                Welcome to the Intern Portal
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#cbd5e1;">
                Dear <strong style="color:#fff;">${firstName}</strong>,
              </p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#94a3b8;">
                Your internship account has been created by your supervising officer. 
                Use the credentials below to sign in to the OGDCL Intern Portal.
              </p>

              <!-- Credentials box -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
                style="background:#0f1117;border:1px solid rgba(255,255,255,0.08);border-radius:10px;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#64748b;">
                      Your login credentials
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:16px;">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                          <span style="font-size:12px;color:#64748b;display:block;margin-bottom:2px;">Email / Username</span>
                          <span style="font-size:15px;font-weight:600;color:#e2e8f0;font-family:monospace;">${to}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="font-size:12px;color:#64748b;display:block;margin-bottom:2px;">Temporary Password</span>
                          <span style="font-size:18px;font-weight:700;color:#2dd4bf;font-family:monospace;letter-spacing:0.05em;">${password}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA button -->
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background:#14b8a6;">
                    <a href="${loginUrl}"
                      style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#042f2e;text-decoration:none;letter-spacing:0.01em;">
                      Sign in to the Portal →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:13px;line-height:1.6;color:#475569;">
                Or copy this link into your browser:<br/>
                <a href="${loginUrl}" style="color:#2dd4bf;word-break:break-all;">${loginUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Security note -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
                style="background:rgba(20,184,166,0.07);border:1px solid rgba(20,184,166,0.2);border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:13px;line-height:1.6;color:#94a3b8;">
                      🔒 <strong style="color:#e2e8f0;">Security reminder:</strong> 
                      This is a temporary password issued by the system. Please change it 
                      after your first login. Do not share your credentials with anyone.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:12px;color:#475569;line-height:1.6;">
                This email was sent by the OGDCL Internship Management System on behalf of 
                your supervising officer. If you believe this was sent in error, contact 
                <a href="mailto:internships@ogdcl.com" style="color:#2dd4bf;">internships@ogdcl.com</a>.
              </p>
              <p style="margin:12px 0 0;font-size:11px;color:#334155;">
                © ${new Date().getFullYear()} Oil &amp; Gas Development Company Limited · Internal system · Authorised users only
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Welcome to the OGDCL Intern Portal, ${firstName}!

Your internship account has been created. Use the credentials below to sign in.

Email:    ${to}
Password: ${password}

Login link: ${loginUrl}

Please change your password after your first login.

— OGDCL Intern System`;

  await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to,
    subject: "Your OGDCL Intern Portal credentials",
    text,
    html,
  });
}

/** Generates a readable random password like OGD-Ab3xP9#
 *  Format: OGD-<4 mixed-case letters><2 digits><1 symbol> */
export function generateInternPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // no I/O confusion
  const lower = "abcdefghjkmnpqrstuvwxyz"; // no l/o confusion
  const digits = "23456789"; // no 0/1 confusion
  const symbols = "#@!&";

  const rand = (set: string) => set[Math.floor(Math.random() * set.length)];

  // 2 upper, 2 lower, 2 digit, 1 symbol → shuffle
  const chars = [
    rand(upper), rand(upper),
    rand(lower), rand(lower),
    rand(digits), rand(digits),
    rand(symbols),
  ];

  // Fisher-Yates shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return `OGD-${chars.join("")}`;
}
