module.exports.handler = async (event) => {

    const bucketName = event['sourceBucket']
    if(!bucketName) {
        throw new Error(`'sourceBucket' is required`);
    }

    const sourceFileKey = event['sourceFileKey']
    if(!sourceFileKey) {
        throw new Error(`'sourceFileKey' is required`);
    }

    //here we emulate file upload to another faulty server
    //the idea is to check step function retries until it successfully 
    //manages to send the file eventually
    console.log('Emulating upload lag and failures to another server');

    //50% of the time the server is down
    if(Math.random()<0.3) {
        throw new Error('Target server is down (30% failure emulation)');
    }

    if(Math.random()<0.2) {
        console.log('Target server will take long to answer (14% failure emulation)');
        await new Promise(r => setTimeout(r, 120000));
        return
    }

    console.log(`Target server receives ${sourceFileKey} successfully (56% success emulation)`);
    const randomLag = 2000 + Math.random()*25000;
    await new Promise(r => setTimeout(r, randomLag));

    return
};
