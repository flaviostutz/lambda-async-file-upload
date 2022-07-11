import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
const stepFunctionsClient = new SFNClient();

const startExecution = async ({stateMachineArn, input, name}) => {
    const command = new StartExecutionCommand({
        stateMachineArn: stateMachineArn,
        input: input,
        name: name //guarantees indepondency
    });
    const data = await stepFunctionsClient.send(command);
}

export { stepFunctionsClient, startExecution }
