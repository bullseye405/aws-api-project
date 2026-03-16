import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
const s3Client = new S3Client({});

export const handler = async (event: any) => {
  try {
    const userId = event.requestContext.authorizer.claims.sub;
    const body = JSON.parse(event.body || '{}');
    const fileKey = body.key; // e.g., "private/user-123/photo.jpg"

    // SECURITY CHECK: Ensure the user is only deleting their own files
    if (!fileKey.startsWith(`private/${userId}/`)) {
      return { statusCode: 403, body: JSON.stringify({ message: "Forbidden" }) };
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.STORAGE_BUCKET,
      Key: fileKey,
    });

    await s3Client.send(command);

    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ message: "File deleted successfully" }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: "Delete failed" }) };
  }
};
