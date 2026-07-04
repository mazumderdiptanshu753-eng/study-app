# Security Specification for STUDY HUB Firestore

## 1. Data Invariants
- **Study Notes Integrity**: A study note must be owned by the authenticated student. The field `userEmail` in the document must match the user's verified token email (`request.auth.token.email`).
- **User Record Security**: Users cannot promote themselves to Admin role. Only verified administrator `mazumderdiptanshu753@gmail.com` is granted the admin status by default.
- **Support Chat Privacy**: Students are only allowed to view or write support chat messages associated with their own `studentEmail`. They cannot read or impersonate other students' chats.
- **Admin Panel Logs**: Activity logs and system records can only be queried or managed by verified Administrators.
- **Govt Job Notes & Live Classes**: Students can read educational materials and class links, but write/update permissions are strictly locked to certified Administrators.

---

## 2. The "Dirty Dozen" Malicious Payloads
These payloads attempt to breach security, modify system state, or spoof identity:

1. **Self-Promotion Attack** (Collection: `users`): A non-admin user attempts to write/update their profile setting `role: "Admin"`.
2. **Note Hijacking / Impersonation** (Collection: `notes`): A logged-in user with email `attacker@study.com` attempts to save a note with `userEmail: "victim@study.com"`.
3. **Ghost Update Attack** (Collection: `notes`): Updating a note with random, non-whitelisted fields (e.g. `isApproved: true`, `premiumFeatures: true`).
4. **Spoofed Chat Injection** (Collection: `chatMessages`): Sending a chat message with `senderEmail: "mazumderdiptanshu753@gmail.com"` (admin spoof) from a non-admin account.
5. **Eavesdropping on Support Chat** (Collection: `chatMessages`): A student account `alice@gmail.com` trying to fetch/list chat messages belonging to `bob@gmail.com`.
6. **Class Modification / Poisoning** (Collection: `liveClasses`): A standard student trying to create, edit, or delete a live class schedule document.
7. **Government Notes Poisoning** (Collection: `govtJobNotes`): A student attempting to publish, edit, or delete study materials in the master Government Exam collection.
8. **Malicious ID Injection** (Collection: `notes`): Attempting to create a note with a giant 100KB string containing escape characters as its document ID (ID poisoning).
9. **Log Interception** (Collection: `activityLogs`): A non-admin student attempting to read the general system activity logs.
10. **Terminal State Locking Bypass** (Collection: `liveClasses`): Standard user attempts to change the class status from "Completed" back to "Live".
11. **Spoofed User Registration** (Collection: `users`): Creating a user document where the document ID (email key) is `mazumderdiptanshu753@gmail.com` but the authenticated user's email is different.
12. **Blanket Query Scraping**: Attempting to run a list query on all notes (`/notes`) without filtering by `userEmail == current_user_email` to steal other users' personal notes.

---

## 3. Security Rules Verification
All "Dirty Dozen" payloads above will return `PERMISSION_DENIED` under the new Fortress security rules.
