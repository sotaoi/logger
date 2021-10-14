declare class LoggerService {
    protected logfile: string;
    protected disabledLogging: boolean;
    protected suppressed: boolean;
    constructor(rootPath: (pathInRoot?: string) => string, logPath: string);
    notice(...textArr: any[]): void;
    info(...textArr: any[]): void;
    warn(...textArr: any[]): void;
    error(...textArr: any[]): void;
    estack(err: any): void;
    wstack(err: any): void;
    suppress(): void;
    unsuppress(): void;
    enableLogging(): void;
    disableLogging(): void;
    protected opLogfile(): void;
}
export { LoggerService };
