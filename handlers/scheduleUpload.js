import { copyFile, fileExists } from '../utils/s3utils';
import { startExecution } from '../utils/stepFunctionsUtils';

const bucketName = process.env.UPLOAD_BUCKET_NAME;
if(!bucketName) {
    throw new Error("env UPLOAD_BUCKET_NAME is required");
}
console.log(`bucketName=${JSON.stringify(bucketName)}`);

const uploadAsyncStepFunctionArn = process.env.STEP_FUNCTION_UPLOAD_ASYNC_ARN;
if(!uploadAsyncStepFunctionArn) {
    throw new Error("env STEP_FUNCTION_UPLOAD_ASYNC_ARN is required");
}
console.log(`uploadAsyncStepFunctionArn=${uploadAsyncStepFunctionArn}`);

module.exports.handler = async (event) => {

    // console.log(JSON.stringify(event, null, 4));

    try {
        const file = event.queryStringParameters['file'];

        if(!file) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message:`Query param 'file' is required`
                }),
            };
        }

        const tmpFileKey = `tmp/${file}`;
        console.log(`Scheduling upload of ${bucketName}:${tmpFileKey}`);

        const exists = await fileExists(bucketName, tmpFileKey);
        if(!exists) {
            console.log(`File ${tmpFileKey} doesn't exist`);
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message:`File doesn't exist in tmp/ folder`
                }),
            };
        }

        console.log(`Copying file ${tmpFileKey} to folder processing/`);
        const targetFileKey = await copyFile(bucketName, tmpFileKey, 'tmp/', 'processing/');

        //TODO Delete file in /tmp folder?

        console.log(`Invoking step function for further async processing`);
        await startExecution({
            stateMachineArn: uploadAsyncStepFunctionArn,
            input: JSON.stringify({
                sourceBucket: bucketName,
                sourceFileKey: targetFileKey
            }),
            name: targetFileKey.replace('/','_') //idempotency key
        })

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'File scheduled for upload successfully',
            }),
        }

    } catch (err) {
        console.error(`Failed to schedule file for upload. err=${err}`);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to schedule file for upload',
            }),
        };
    }
};
