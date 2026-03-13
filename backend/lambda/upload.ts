import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({});
export const handler = async (event: any) => {
  try {
    const userId = event.requestContext?.authorizer?.claims?.sub;
    const body = JSON.parse(event.body || '{}');
    const fileName = body.fileName || `file-${Date.now()}`;

    const key = `private/${userId}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET,
      Key: key,
      ContentType: body.contentType || 'application/octet-stream',
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Required for local testing (Vite)
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
      },
      // 4. CRITICAL: Stringify the response body
      body: JSON.stringify({
        uploadUrl,
        key,
      }),
    };
  } catch (err) {
    console.error('Upload Lambda Error:', err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: String(err),
      }),
    };
  }
};
