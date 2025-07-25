interface ILogger {
    info(message: string): void;
    error(message: string, error?: Error): void;
    warn(message: string): void;
    debug(message: string): void;
}

export default ILogger;