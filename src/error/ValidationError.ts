class ValidationError extends Error {
    public _statusCode: number;
    public _errors: string[];

    constructor(errors: string[], message = `Validation failed`) {
        super(message);
        this._statusCode = 400;
        this._errors = errors;

        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export default ValidationError;
