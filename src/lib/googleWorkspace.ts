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
  access_type: "offline"
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

// UTF-8 Base64URL encoder for RFC 2822 email format
function encodeBase64UrlEmail(to: string, from: string, subject: string, htmlBody: string): string {
  // UTF-8 encode subject header
  const encodedSubject = `=?utf-8?B?${window.btoa(unescape(encodeURIComponent(subject)))}?=`;
  
  const emailLines = [
    `From: Study Hub Academic Portal <${from}>`,
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
  adminEmail: string,
  studentEmail: string,
  studentName: string,
  courseOrExam?: string
): Promise<{ success: boolean; messageId?: string }> {
  const subject = `স্টাডি হাবে স্বাগতম! আপনার অ্যাকাউন্ট সফলভাবে অনুমোদিত হয়েছে 🎉`;
  const appOrigin = typeof window !== "undefined" ? window.location.origin : "https://studyhub.edu";

  const htmlBody = `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Study Hub Approval</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
    
    <!-- Header with colorful gradient -->
    <div style="background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 36px 24px; text-align: center; color: #ffffff;">
      <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 30px; font-size: 13px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; backdrop-blur: 5px;">
        🎓 STUDY HUB PORTAL
      </div>
      <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">আবেদন সফলভাবে অনুমোদিত হয়েছে!</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">শিক্ষা ও এআই সমন্বিত ডিজিটাল প্ল্যাটফর্ম</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 36px 28px;">
      
      <!-- Greeting -->
      <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px; font-weight: 800;">
        প্রিয় ${studentName},
      </h2>
      
      <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.7; color: #334155;">
        স্টাডি হাব অ্যাকাডেমিক পোর্টালে যুক্ত হওয়ার জন্য আপনার আবেদনটি অ্যাডমিন কর্তৃক সফলভাবে যাচাই ও <strong>অনুমোদন (Approved)</strong> করা হয়েছে।
      </p>

      <!-- Details Card -->
      <div style="background: #f1f5f9; border-radius: 14px; padding: 20px; margin-bottom: 24px; border-left: 5px solid #4f46e5;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 140px;">শিক্ষার্থীর নাম:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${studentName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">অনুমোদিত ইমেইল:</td>
            <td style="padding: 6px 0; color: #4f46e5; font-weight: 700;">${studentEmail}</td>
          </tr>
          ${courseOrExam ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">কোর্স / পরীক্ষা:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${courseOrExam}</td>
          </tr>
          ` : ""}
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 600;">স্ট্যাটাস:</td>
            <td style="padding: 6px 0; color: #059669; font-weight: 800;">✅ সক্রিয় শিক্ষার্থী (Active Member)</td>
          </tr>
        </table>
      </div>

      <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
        এখন থেকে আপনি এই অনুমোদিত ইমেইল দিয়ে সরাসরি স্টাডি হাবে লগইন করতে পারবেন এবং আমাদের এআই ডাউট সলভার, স্টাডি নোটস, প্রিমিয়াম ভিডিও লেকচার ও লাইভ ক্লাসের সব সুবিধা ভোগ করতে পারবেন।
      </p>

      <!-- Action Button -->
      <div style="text-align: center; margin: 32px 0 24px 0;">
        <a href="${appOrigin}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff !important; text-decoration: none; padding: 15px 36px; border-radius: 12px; font-weight: 800; font-size: 15px; box-shadow: 0 6px 20px rgba(79, 70, 229, 0.35); letter-spacing: 0.5px;">
          🚀 স্টাডি হাবে প্রবেশ করুন (Login Now)
        </a>
      </div>

      <div style="background: #eef2ff; border-radius: 12px; padding: 14px 18px; margin-top: 24px;">
        <p style="margin: 0; font-size: 12px; color: #4338ca; line-height: 1.5;">
          💡 <strong>পরামর্শ:</strong> লগইন করার সময় আপনার এই ইমেইলটি (<code>${studentEmail}</code>) ব্যবহার করুন।
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
      <p style="margin: 0 0 4px 0;">অনুমোদনকারী: <strong>Diptanshu Mazumder</strong> (${adminEmail})</p>
      <p style="margin: 0;">STUDY HUB ACADEMIC PLATFORM &bull; West Bengal & Bangladesh</p>
    </div>

  </div>
</body>
</html>
  `;

  const raw = encodeBase64UrlEmail(studentEmail, adminEmail, subject, htmlBody);

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
