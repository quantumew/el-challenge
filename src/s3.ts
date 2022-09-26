import { S3 } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

/**
 * Retrieves CSV data from S3
 */
export const getObject = async (): Promise<string> => {
  const aggregatedS3 = new S3({});
  const obj = await aggregatedS3.getObject({
    Key: process.env.DATA_KEY,
    Bucket: process.env.DATA_BUCKET,
  });

  const rawData = await streamToString(obj.Body as Readable);

  return rawData;
};

/**
 * This function streams a readable into memory.... Quick and dirty way to grab data. Normally I would not do this.
 */
const streamToString = (stream: Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
