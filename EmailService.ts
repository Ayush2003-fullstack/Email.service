class EmailService {
    private primaryProvider: IEmailProvider;
    private secondaryProvider: IEmailProvider;
    private sentEmails: Set<string> = new Set();
    private rateLimit: number;
    private rateCount: number = 0;
    private rateResetTimeout: NodeJS.Timeout | null = null;

    constructor(primary: IEmailProvider, secondary: IEmailProvider, rateLimit: number = 5) {
        this.primaryProvider = primary;
        this.secondaryProvider = secondary;
        this.rateLimit = rateLimit;
    }

    private checkRateLimit() {
        if (this.rateCount >= this.rateLimit) {
            throw new Error('Rate limit exceeded');
        }

        if (!this.rateResetTimeout) {
            this.rateResetTimeout = setTimeout(() => {
                this.rateCount = 0;
                this.rateResetTimeout = null;
            }, 60000); // Reset rate limit every minute
        }

        this.rateCount++;
    }

    async sendEmail(email: Email): Promise<void> {
        if (this.sentEmails.has(email.id)) {
            console.log('Duplicate email detected, skipping...');
            return;
        }

        this.checkRateLimit();

        try {
            const status = await retryWithExponentialBackoff(() => this.primaryProvider.send(email));
            if (status === "success") {
                this.sentEmails.add(email.id);
                return;
            }
            throw new Error("Primary provider failed");
        } catch (error) {
            console.log("Falling back to secondary provider...");
            const status = await retryWithExponentialBackoff(() => this.secondaryProvider.send(email));
            if (status === "success") {
                this.sentEmails.add(email.id);
                return;
            }
            console.error("Both providers failed to send the email.");
        }
    }
}
