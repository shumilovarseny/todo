export class HttpError extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.name = "HttpError";
    }
}

export class AlreadyExistsError extends HttpError {
    constructor(message = "Already Exists") {
        super(message, 409, "ERR_ALREADY_EXISTS");
    }
}

export class FailedComplete extends HttpError {
    constructor(message = "Failed Complete") {
        super(message, 500, "ERR_FAILDED_COMPLETE");
    }
}

export class AccessDenied extends HttpError {
    constructor(message = "Access Denied") {
        super(message, 403, "ERR_ACCESS_DENIES");
    }
}

export class NoDataFound extends HttpError {
    constructor(message = "No Data Found") {
        super(message, 404, "ERR_NO_DATA_FOUND");
    }
}

export const returnErrorInfo = (err) => {
    if (err instanceof Error) {
        let statusCode = "ERR_INTERNAL_SERVER", errorCode = 500;
        if (err instanceof HttpError) {
            statusCode = err.statusCode;
            errorCode = err.errorCode;
        }
        return {
            error: {
                statusCode,
                errorCode,
            }
        }
    } else return {};
}