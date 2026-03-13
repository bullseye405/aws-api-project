import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({});

export const handler = async (event: any) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const bucketName = process.env.STORAGE_BUCKET;

  // 1. Get the list of keys
  const listCommand = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: `private/${userId}/`,
  });

  const { Contents } = await s3Client.send(listCommand);

  // 2. Generate a temporary "viewing" URL for each file
  const fileDataPromises = (Contents || []).map(async (item) => {
    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: item.Key,
    });

    const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 }); // Valid for 1 hour

    return {
      key: item.Key,
      fileName: item.Key?.split('/').pop(), // Just the name, not the path
      url: url,
    };
  });
  const fileData = await Promise.all(fileDataPromises);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ files: fileData }),
  };
};
