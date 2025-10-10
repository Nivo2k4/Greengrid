export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = 400;
        this.name = 'ApiError';
    }
}