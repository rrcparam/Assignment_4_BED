import morgan, { StreamOptions } from "morgan";
import fs from "fs";
import path from "path";

// i make sure that logs directory exists
const logsDir = path.join(__dirname, "../../../logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// This is going to Create a write stream for access logs
const accessLogStream = fs.createWriteStream(path.join(logsDir, "access.log"), {
    flags: "a",
});

//  THAT Define custom stream options for error logging
const errorLogStream: StreamOptions = {
    write: (message) =>
        fs.appendFileSync(path.join(logsDir, "error.log"), message),
};

//  This is for the Setup of the logger for access logs means(all requests)
const accessLogger = morgan("combined", { stream: accessLogStream });

// Settting  the logger for error logs 
const errorLogger = morgan("combined", {
    stream: errorLogStream,
    skip: (req, res) => res.statusCode < 400,
});

// Thiss is Console logger for development
const consoleLogger = morgan("dev");

export { accessLogger, errorLogger, consoleLogger };
