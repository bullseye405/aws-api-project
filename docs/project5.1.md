# Project 5: My Private Vault 🔐

In this milestone, you'll enhance your app to support secure file uploads and downloads for authenticated users.

## ✅ Goals

- Allow a **logged-in user** to select a file from their computer and upload it.
- Save the file in a **private S3 folder** named after the user's unique **Cognito User ID**.
- Display a **list of uploaded files** for the user, with links to **download** each file.

---

## 🧠 Key AWS Concepts You Will Learn

### S3 Pre-signed URLs

Instead of making your S3 bucket public (which is a major security risk), you will generate temporary “keys” that give a user access to a file for a short time (e.g., 5 minutes).

### Direct Uploads

Upload files directly from the browser to S3 without sending them through your Lambda function. This is more efficient for large files and reduces Lambda execution time.

### Granular Permissions (Per-User Isolation)

Use Cognito Identity to ensure **User A can never see User B’s files**. Each user gets their own private folder in S3 and only the correct identity can access it.

---

## 🛠️ Recommended Implementation Steps

1. **Generate a unique folder path** using the Cognito Identity ID (e.g., `users/{identityId}/`).
2. **Create a presigned upload URL** in your backend (Lambda) for the target S3 key.
3. **Upload directly from the browser** to S3 using the presigned URL.
4. **List objects** in the user's folder and generate presigned download URLs for each.

---

## ✅ What Success Looks Like

- Users can upload files and see them listed immediately.
- Each file is stored under the user's private S3 folder.
- Download links work only for the authorized user and expire after a short period.
