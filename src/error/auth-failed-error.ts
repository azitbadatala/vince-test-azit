export class AuthFailedError extends Error {
    constructor(message) {
        super(message);
        this.name = "DecodeError"
    }
}