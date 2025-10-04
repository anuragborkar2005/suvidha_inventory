class ApiError extends Error {
    statusCode;
    data;
    success;
    errors;
    constructor(statusCode, message = "Something went wrong", errors = [], stack) {
        super(message);
        // Ensure correct name for the error
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;
        // Restore prototype chain (important when targeting ES5 or transpiled outputs)
        Object.setPrototypeOf(this, new.target.prototype);
        if (stack) {
            this.stack = stack;
        }
        else if (typeof Error.captureStackTrace === "function") {
            // Node.js specific; guard for environments where captureStackTrace isn't available
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export { ApiError };
//# sourceMappingURL=ApiError.js.map