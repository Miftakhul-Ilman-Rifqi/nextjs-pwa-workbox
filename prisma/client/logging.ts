import chalk from "chalk";
import winston from "winston";

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
    const colorizedLevel = (() => {
        switch (level) {
            case "error":
                return chalk.red(level);
            case "warn":
                return chalk.yellow(level);
            case "info":
                return chalk.green(level);
            case "debug":
                return chalk.blue(level);
            default:
                return chalk.white(level);
        }
    })();

    let formattedMessage = message;
    if (typeof message === "object") {
        formattedMessage = JSON.stringify(message, null, 2);
    }

    return `${chalk.gray(
        timestamp
    )} [${colorizedLevel}]: ${formattedMessage}\n`;
});

export const logger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        customFormat
    ),
    transports: [new winston.transports.Console()],
});
