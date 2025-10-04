class ApiError extends Error {
  statusCode: number;
  data: any;
  success: boolean;
  errors: string[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: string[] = [],
    stack?: string
  ) {
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
    } else if (typeof (Error as any).captureStackTrace === "function") {
      // Node.js specific; guard for environments where captureStackTrace isn't available
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
