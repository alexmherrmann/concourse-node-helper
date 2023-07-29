
function readStdinAsPromise(maxSizeInBytes = 12 * 1024, timeoutInMilliseconds = 1000): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = '';
        let bytesRead = 0;

        process.stdin.setEncoding('utf8');

        const onData = (chunk: string) => {
            bytesRead += chunk.length;
            if (bytesRead > maxSizeInBytes) {
                reject(new Error('Input data size exceeds the limit'));
                cleanup();
            } else {
                data += chunk;
            }
        };

        const onEnd = () => {
            resolve(data);
            cleanup();
        };

        const onError = (err: any) => {
            reject(err);
            cleanup();
        };

        process.stdin.on('readable', () => {
            let chunk;
            while ((chunk = process.stdin.read())) {
                onData(chunk);
            }
        });

        process.stdin.on('end', onEnd);
        process.stdin.on('error', onError);

        // Timeout to handle cases where the input stream is not closed properly
        const timeout = setTimeout(() => {
            reject(new Error('Input stream not closed in a timely manner'));
            cleanup();
        }, timeoutInMilliseconds);

        const cleanup = () => {
            process.stdin.removeListener('readable', onData);
            process.stdin.removeListener('end', onEnd);
            process.stdin.removeListener('error', onError);
            clearTimeout(timeout);
        };
    });
}

function logit(message: string): void {
    process.stderr.write(message + "\n")
}

export type Version = {
    ref: string,
    [key: string]: string
}

export type Metadata = {
    name: string,
    value: string,
}

export type CheckInput<SOURCETYPE> = {
    source: SOURCETYPE,
    version: Version
}

export type CheckOutput = Version[]

export type InInput<SOURCETYPE> = {
    source: SOURCETYPE,
    version: Version
}

export type InOutput = {
    version: Version,
    metadata?: Metadata[]
}

export type OutInput<SOURCETYPE> = {
    source: SOURCETYPE,
    params: {
        [key: string]: string
    },
    version: Version
}
export type OutOutput<SOURCETYPE> = {
    version: Version,
    metadata?: Metadata[]
}


export function wrapCheck<SOURCETYPE>(check: (input: CheckInput<SOURCETYPE>) => Promise<CheckOutput>): () => Promise<void> {
    return async () => {
        // read the input from stdin
        const input = await readStdinAsPromise()

        // Parse it into a CheckInput
        const parsedInput: CheckInput<SOURCETYPE> = JSON.parse(input)

        // Run the check function
        const output = await check(parsedInput)

        // Write the output to stdout
        process.stdout.write(JSON.stringify(output), () => process.exit(0))


    }
}

export function wrapIn<SOURCETYPE>(inFunc: (input: InInput<SOURCETYPE>) => Promise<InOutput>): () => Promise<void> {
    return async () => {
        logit(`Changing to ${process.argv[2]}`)
        process.chdir(process.argv[2])
        
        // read the input from stdin
        const input = await readStdinAsPromise()

        // Parse it into a CheckInput
        const parsedInput: InInput<SOURCETYPE> = JSON.parse(input)

        // Run the check function
        const output = await inFunc(parsedInput)

        // Write the output to stdout
        process.stdout.write(JSON.stringify(output), () => process.exit(0))
    }
}

export function wrapOut<SOURCETYPE>(outFunc: (input: OutInput<SOURCETYPE>) => Promise<OutOutput<SOURCETYPE>>): () => Promise<void> {
    return async () => {
        logit(`Changing to ${process.argv[2]}`)
        process.chdir(process.argv[2])

        // read the input from stdin
        const input = await readStdinAsPromise()

        // Parse it into a CheckInput
        const parsedInput: OutInput<SOURCETYPE> = JSON.parse(input)

        // Run the check function
        const output = await outFunc(parsedInput)

        // Write the output to stdout
        process.stdout.write(JSON.stringify(output), () => process.exit(0))

    }

}