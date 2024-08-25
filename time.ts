const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithExponentialBackoff<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 500
): Promise<T> {
    let attempt = 0;
    while (attempt < retries) {
        try {
            return await fn();
        } catch (error) {
            attempt++;
            const backoff = delay * Math.pow(2, attempt);
            console.log(`Retrying in ${backoff}ms...`);
            await sleep(backoff);
        }
    }
    throw new Error('Maximum retries exceeded');
}
