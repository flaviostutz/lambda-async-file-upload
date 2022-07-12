import { S3Client, DeleteObjectCommand, CopyObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client();
// const s3Client = new S3Client({ region: 'us-west-1' });

const copyFile = async (bucketName, sourceFileKey, sourceFolder, destinationFolder) => {
  const targetFileKey = `${sourceFileKey.replace(sourceFolder, destinationFolder)}`;
  const command = new CopyObjectCommand({
    CopySource: `${bucketName}/${sourceFileKey}`,  // old file Key
    Bucket: bucketName,
    Key: targetFileKey, // new file Key
  });
  await s3Client.send(command);
  return targetFileKey;
}

const deleteFile = async (bucketName, fileKey) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });
  await s3Client.send(command);
}

const fileExists = async (bucketName, fileKey) => {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });
    await s3Client.send(command);
    return true
  } catch (err) {
    console.log(`err=${JSON.stringify(err)}`);
    if (err.code === 'NotFound') {
      return false;
    }
    throw new Error(`Couldn't head file ${bucketName} ${fileKey}. err=${err}`);
  }
}

export { s3Client, copyFile, deleteFile, fileExists };
