"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LoggerService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const flatted_1 = require("flatted");
let _logger;
const log = console.log;
const warn = console.warn;
const error = console.error;
class LoggerService {
    constructor(rootPath, logPath) {
        this.logfile = path_1.default.resolve('./app.log');
        this.disabledLogging = !logPath;
        this.suppressed = false;
        if (this.disabledLogging) {
            return;
        }
        const today = new Date().toISOString().substr(0, 10).replace('T', ' ');
        // this.logfile = path.resolve(rootPath(logPath), `${today}-app.log`);
        this.logfile = path_1.default.resolve(logPath, `${today}-app.log`);
        const dirname = path_1.default.dirname(this.logfile);
        !fs_1.default.existsSync(dirname) && fs_1.default.mkdirSync(dirname, { recursive: true });
        !fs_1.default.existsSync(this.logfile) && fs_1.default.writeFileSync(this.logfile, '');
    }
    notice(...textArr) {
        if (this.suppressed || this.disabledLogging) {
            return;
        }
        !(textArr instanceof Array) && (textArr = [textArr]);
        this.opLogfile();
        let header = new Date().toISOString().substr(0, 19).replace('T', ' ');
        header = `[${header}] NOTICE:`;
        textArr.map((text) => {
            log(header, text);
            const flatText = typeof text === 'object' ? flatted_1.stringify(text) : String(text);
            fs_1.default.appendFileSync(this.logfile, header + ' ' + flatText + '\n\n');
        });
    }
    info(...textArr) {
        if (this.suppressed || this.disabledLogging) {
            return;
        }
        !(textArr instanceof Array) && (textArr = [textArr]);
        this.opLogfile();
        let header = new Date().toISOString().substr(0, 19).replace('T', ' ');
        header = `[${header}] INFO:`;
        textArr.map((text) => {
            log(header, text);
            const flatText = typeof text === 'object' ? flatted_1.stringify(text) : String(text);
            fs_1.default.appendFileSync(this.logfile, header + ' ' + flatText + '\n\n');
        });
    }
    warn(...textArr) {
        if (this.suppressed || this.disabledLogging) {
            return;
        }
        !(textArr instanceof Array) && (textArr = [textArr]);
        this.opLogfile();
        let header = new Date().toISOString().substr(0, 19).replace('T', ' ');
        header = `[${header}] WARNING:`;
        textArr.map((text) => {
            warn(chalk_1.default.yellow(header, text));
            const flatText = typeof text === 'object' ? flatted_1.stringify(text) : String(text);
            fs_1.default.appendFileSync(this.logfile, header + ' ' + flatText + '\n\n');
        });
    }
    error(...textArr) {
        if (this.suppressed || this.disabledLogging) {
            return;
        }
        this.opLogfile();
        let header = new Date().toISOString().substr(0, 19).replace('T', ' ');
        header = `[${header}] ERROR:`;
        textArr.map((text) => {
            if (text && text instanceof Error) {
                text = text.stack ? text.stack : JSON.stringify(text);
            }
            error(chalk_1.default.red(header, text));
            const flatText = typeof text === 'object' ? flatted_1.stringify(text) : String(text);
            fs_1.default.appendFileSync(this.logfile, header + ' ' + flatText + '\n\n');
        });
    }
    estack(err) {
        if (this.suppressed || this.disabledLogging) {
            return;
        }
        this.opLogfile();
        const text = err && err.stack ? err.stack : typeof err === 'string' ? err : JSON.stringify(err);
        let header = new Date().toISOString().substr(0, 19).replace('T', ' ');
        header = `[${header}] ERROR:`;
        error(chalk_1.default.red(header, text));
        const flatText = typeof text === 'object' ? flatted_1.stringify(text) : String(text);
        fs_1.default.appendFileSync(this.logfile, header + ' ' + flatText + '\n\n');
    }
    wstack(err) {
        if (this.suppressed || this.disabledLogging) {
            return;
        }
        this.opLogfile();
        const text = err && err.stack ? err.stack : typeof err === 'string' ? err : JSON.stringify(err);
        let header = new Date().toISOString().substr(0, 19).replace('T', ' ');
        header = `[${header}] WARNING:`;
        error(chalk_1.default.yellow(header, text));
        const flatText = typeof text === 'object' ? flatted_1.stringify(text) : String(text);
        fs_1.default.appendFileSync(this.logfile, header + ' ' + flatText + '\n\n');
    }
    suppress() {
        this.suppressed = true;
    }
    unsuppress() {
        this.suppressed = false;
    }
    enableLogging() {
        this.disabledLogging = false;
    }
    disableLogging() {
        this.disabledLogging = true;
    }
    opLogfile() {
        if (this.disabledLogging) {
            return;
        }
        if (!fs_1.default.existsSync(this.logfile)) {
            const dir = path_1.default.dirname(this.logfile);
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true });
            }
            fs_1.default.writeFileSync(this.logfile, '');
        }
    }
}
exports.LoggerService = LoggerService;
const logger = () => {
    if (typeof _logger !== 'undefined') {
        return _logger;
    }
    _logger = new LoggerService(() => path_1.default.resolve(''), '');
    return _logger;
};
exports.logger = logger;
