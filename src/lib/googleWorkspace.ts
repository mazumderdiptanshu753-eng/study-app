import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import workspaceConfig from "../../firebase-applet-config.json";

// Scopes required for Gmail API
export const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.send"
];

const WORKSPACE_APP_NAME = "studyhub-workspace-auth";

const workspaceApp = getApps().some(a => a.name === WORKSPACE_APP_NAME)
  ? getApp(WORKSPACE_APP_NAME)
  : initializeApp(workspaceConfig, WORKSPACE_APP_NAME);

export const workspaceAuth = getAuth(workspaceApp);

const provider = new GoogleAuthProvider();
GMAIL_SCOPES.forEach(scope => provider.addScope(scope));
provider.setCustomParameters({
  prompt: "consent",
  access_type: "offline",
  login_hint: "studyhub2026admin@gmail.com"
});

// In-memory token cache (Do NOT store in localStorage per security guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Auth state listener
export const initWorkspaceAuth = (
  onSuccess?: (user: User, token: string) => void,
  onFailure?: () => void
) => {
  return onAuthStateChanged(workspaceAuth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onSuccess) onSuccess(user, cachedAccessToken);
    } else {
      if (onFailure) onFailure();
    }
  });
};

// Sign in with Google to get Gmail access token
export const signInWithGoogleForGmail = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(workspaceAuth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Google Authentication did not return a Gmail access token.");
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Gmail Sign-in error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getGmailAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setGmailAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const workspaceLogout = async () => {
  await workspaceAuth.signOut();
  cachedAccessToken = null;
};

export const OFFICIAL_ADMIN_SENDER_EMAIL = "studyhub2026admin@gmail.com";

// UTF-8 Base64URL encoder for RFC 2822 email format
function encodeBase64UrlEmail(to: string, from: string, subject: string, htmlBody: string): string {
  // UTF-8 encode subject header
  const encodedSubject = `=?utf-8?B?${window.btoa(unescape(encodeURIComponent(subject)))}?=`;
  
  const emailLines = [
    `From: Study Hub Official Administration <${from}>`,
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    window.btoa(unescape(encodeURIComponent(htmlBody)))
  ];

  const rfc2822Message = emailLines.join("\r\n");
  return window.btoa(unescape(encodeURIComponent(rfc2822Message)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Send official student approval email via Gmail API
export async function sendStudentApprovalGmail(
  accessToken: string,
  _adminEmail: string,
  studentEmail: string,
  studentName: string,
  password?: string,
  courseOrExam?: string
): Promise<{ success: boolean; messageId?: string }> {
  // Always send official approval emails from studyhub2026admin@gmail.com
  const senderEmail = OFFICIAL_ADMIN_SENDER_EMAIL;
  const subject = "Welcome to Study Hub! Your Account Has Been Approved 🎉";
  const appOrigin = typeof window !== "undefined" ? window.location.origin : "https://studyhub.edu";

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Study Hub - Account Approved</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
    
    <!-- Hero Banner with Colorful Gradient -->
    <div style="background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 40px 24px; text-align: center; color: #ffffff;">
      <div style="display: inline-block; background: rgba(255,255,255,0.22); padding: 8px 18px; border-radius: 30px; font-size: 12px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 14px; backdrop-filter: blur(8px);">
        🎓 STUDY HUB ACADEMIC PORTAL
      </div>
      <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; line-height: 1.2;">
        Welcome Aboard! Access Granted 🎉
      </h1>
      <p style="margin: 10px 0 0 0; opacity: 0.92; font-size: 14px; font-weight: 500;">
        Your student registration request has been approved by the Administration.
      </p>
    </div>

    <!-- Main Content Container -->
    <div style="padding: 36px 30px;">
      
      <!-- Greeting -->
      <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 21px; font-weight: 800;">
        Dear ${studentName},
      </h2>
      
      <p style="margin: 0 0 22px 0; font-size: 15px; color: #334155; line-height: 1.7;">
        Congratulations! Your application to join <strong>Study Hub</strong> has been officially reviewed and <strong style="color: #059669;">Approved</strong>. Your personal student workspace is now fully activated.
      </p>

      <!-- Account Summary Card -->
      <div style="background: #f8fafc; border-radius: 16px; padding: 22px; margin-bottom: 26px; border: 1px solid #e2e8f0; border-left: 5px solid #4f46e5;">
        <h3 style="margin: 0 0 14px 0; font-size: 13px; font-weight: 800; color: #4338ca; text-transform: uppercase; letter-spacing: 0.8px;">
          📋 Student Credentials &amp; Status
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 140px;">Student Name:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${studentName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Authorized User ID:</td>
            <td style="padding: 6px 0; color: #4f46e5; font-weight: 700;">${studentEmail}</td>
          </tr>
          ${password ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Account Password:</td>
            <td style="padding: 6px 0; color: #dc2626; font-weight: 800; font-family: monospace;">${password}</td>
          </tr>
          ` : ""}
          ${courseOrExam ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Target Goal / Exam:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${courseOrExam}</td>
          </tr>
          ` : ""}
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Account Status:</td>
            <td style="padding: 6px 0; color: #059669; font-weight: 800;">
              <span style="display: inline-block; background: #ecfdf5; color: #059669; padding: 2px 8px; border-radius: 6px; font-size: 12px; border: 1px solid #a7f3d0;">
                ✅ Active &amp; Verified
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Official Sender:</td>
            <td style="padding: 6px 0; color: #475569; font-weight: 600; font-family: monospace;">${senderEmail}</td>
          </tr>
        </table>
      </div>

      <!-- Feature Highlights -->
      <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
        ✨ What you can do on Study Hub:
      </h4>
      <ul style="margin: 0 0 26px 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.8;">
        <li><strong>AI Doubt Solver:</strong> Ask complex academic questions with instant, step-by-step solutions.</li>
        <li><strong>Study Desk &amp; Notes:</strong> Access curated subject notes, summaries, and interactive flashcards.</li>
        <li><strong>Video Classes &amp; Lectures:</strong> Watch recorded lessons and participate in live doubt clearing sessions.</li>
        <li><strong>Community Forum:</strong> Connect with mentors, ask queries, and discuss academic topics with peers.</li>
      </ul>

      <!-- Primary Call to Action Button -->
      <div style="text-align: center; margin: 34px 0 28px 0;">
        <a href="${appOrigin}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff !important; text-decoration: none; padding: 15px 38px; border-radius: 12px; font-weight: 800; font-size: 15px; box-shadow: 0 6px 22px rgba(79, 70, 229, 0.35); letter-spacing: 0.5px;">
          🚀 Log In to Study Hub Now
        </a>
      </div>

      <!-- Quick Guidance Box -->
      <div style="background: #eef2ff; border-radius: 12px; padding: 16px 20px; margin-top: 24px; border: 1px solid #c7d2fe;">
        <p style="margin: 0; font-size: 13px; color: #3730a3; line-height: 1.6;">
          💡 <strong>How to Log In:</strong> Go to the Study Hub login page and enter your User ID (<code>${studentEmail}</code>) and your Password${password ? ` (<code>${password}</code>)` : ""} to access your dashboard.
        </p>
      </div>

    </div>

    <!-- Official Email Footer -->
    <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 22px 24px; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.6;">
      <p style="margin: 0 0 4px 0; font-weight: 700; color: #64748b;">
        Study Hub Official Administration &bull; <a href="mailto:${senderEmail}" style="color: #4f46e5; text-decoration: none;">${senderEmail}</a>
      </p>
      <p style="margin: 0;">
        &copy; 2026 Study Hub Academic Platform. Dedicated to educational excellence.
      </p>
    </div>

  </div>
</body>
</html>
  `;

  const raw = encodeBase64UrlEmail(studentEmail, senderEmail, subject, htmlBody);

  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ raw })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gmail API returned ${response.status}`);
  }

  const data = await response.json();
  return { success: true, messageId: data.id };
}

// Generate direct Gmail Compose & mailto links (100% reliable on mobile phones & tablets)
export function getStudentApprovalMailtoLink(
  studentEmail: string,
  studentName: string,
  password?: string,
  courseOrExam?: string
): { subject: string; plainBody: string; webUrl: string; mailtoUrl: string } {
  const subject = "Welcome to Study Hub! Your Account Has Been Approved 🎉";
  const appOrigin = typeof window !== "undefined" ? window.location.origin : "https://studyhub.edu";
  
  const plainBody = `Dear ${studentName},

Congratulations! Your application to join Study Hub has been officially reviewed and Approved. Your personal student workspace is now fully activated.

📋 STUDENT CREDENTIALS & STATUS:
- Student Name: ${studentName}
- Authorized User ID: ${studentEmail}
${password ? `- Account Password: ${password}\n` : ""}${courseOrExam ? `- Target Goal / Exam: ${courseOrExam}\n` : ""}- Account Status: Active & Verified
- Official Sender: ${OFFICIAL_ADMIN_SENDER_EMAIL}

✨ WHAT YOU CAN DO ON STUDY HUB:
1. AI Doubt Solver: Ask complex academic questions with instant, step-by-step solutions.
2. Study Desk & Notes: Access curated subject notes, summaries, and flashcards.
3. Video Classes & Lectures: Watch recorded lessons and participate in doubt clearing.
4. Community Forum: Connect with mentors and peers.

🚀 LOG IN TO STUDY HUB NOW:
${appOrigin}

💡 How to Log In:
Go to the Study Hub login page and enter your User ID (${studentEmail}) and your Password${password ? ` (${password})` : ""} to access your dashboard.

Best regards,
Study Hub Official Administration
${OFFICIAL_ADMIN_SENDER_EMAIL}`;

  const webUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(studentEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainBody)}`;
  const mailtoUrl = `mailto:${encodeURIComponent(studentEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainBody)}`;

  return { subject, plainBody, webUrl, mailtoUrl };
}

// Send official OTP verification email via Gmail API
export async function sendOfficialOtpViaGmailApi(
  accessToken: string,
  studentEmail: string,
  studentName: string,
  otp: string
): Promise<{ success: boolean; messageId?: string }> {
  const senderEmail = OFFICIAL_ADMIN_SENDER_EMAIL;
  const subject = `Your Study Hub Password Recovery OTP: ${otp}`;

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Study Hub - Password Recovery OTP</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
  <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
    <div style="background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
      <div style="display: inline-block; background: rgba(255,255,255,0.22); padding: 6px 16px; border-radius: 30px; font-size: 11px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 12px;">
        🎓 STUDY HUB OFFICIAL DISPATCH
      </div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">
        Password Recovery Verification 🔑
      </h1>
      <p style="margin: 8px 0 0 0; opacity: 0.92; font-size: 13px;">
        Official security code for your account recovery
      </p>
    </div>

    <div style="padding: 28px 24px;">
      <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #0f172a; font-weight: 800;">
        Hello ${studentName || "Student"},
      </h2>
      <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569; line-height: 1.6;">
        A password recovery request was initiated for your Study Hub account (<strong style="color: #4f46e5;">${studentEmail}</strong>). Please use the following official One-Time Password (OTP) to view your existing account password:
      </p>

      <div style="background: #f8fafc; border: 2px dashed #6366f1; border-radius: 16px; padding: 22px; text-align: center; margin: 24px 0;">
        <span style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">
          Your One-Time Password (OTP)
        </span>
        <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 6px; color: #4338ca; display: inline-block;">
          ${otp}
        </span>
        <span style="font-size: 11px; font-weight: 600; color: #ef4444; display: block; margin-top: 8px;">
          ⏱️ This OTP code is valid for 10 minutes only.
        </span>
      </div>

      <p style="margin: 0 0 16px 0; font-size: 13px; color: #64748b; line-height: 1.6;">
        🛡️ <strong>Security Tip:</strong> Never share this code with anyone. Study Hub administrators will never ask for your password or OTP. If you did not initiate this request, you can safely ignore this email.
      </p>
    </div>

    <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
      <p style="margin: 0 0 4px 0; font-weight: 700; color: #64748b;">
        Study Hub Official Administration &bull; <a href="mailto:${senderEmail}" style="color: #4f46e5; text-decoration: none;">${senderEmail}</a>
      </p>
      <p style="margin: 0;">&copy; 2026 Study Hub. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  const raw = encodeBase64UrlEmail(studentEmail, senderEmail, subject, htmlBody);
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ raw })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gmail API returned ${response.status}`);
  }

  const data = await response.json();
  return { success: true, messageId: data.id };
}

