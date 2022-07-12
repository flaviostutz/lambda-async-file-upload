import { deleteFile } from '../utils/s3utils';
module.exports.handler = async (event) => {

    const bucketName = event['sourceBucket']
    if(!bucketName) {
        throw new Error(`'sourceBucket' is required`);
    }
    const sourceFileKey = event['sourceFileKey']
    if(!sourceFileKey) {
        throw new Error(`'sourceFileKey' is required`);
    }

    console.log(`Deleting file ${bucketName}:${sourceFileKey}`)
    await deleteFile(bucketName, sourceFileKey);

    return {};
};
