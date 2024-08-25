type Email = {
    to: string;
    subject: string;
    body: string;
    id: string;
};

type ProviderStatus = "success" | "failure";

interface IEmailProvider {
    send(email: Email): Promise<ProviderStatus>;
}

class MockEmailProvider implements IEmailProvider {
    private name: string;
    constructor(name: string) {
        this.name = name;
    }

    async send(email: Email): Promise<ProviderStatus> {
        // Simulate random failure
        if (Math.random() > 0.7) {
            console.log(`[${this.name}] Email failed to send.`);
            return "failure";
        }
        console.log(`[${this.name}] Email sent successfully.`);
        return "success";
    }
}
