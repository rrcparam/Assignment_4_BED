import express, { Express } from "express";
import loanRoutes from "./api/v1/routes/loanRoutes";
import errorHandler from "./api/v1/middleware/errorHandler";
import userRoutes from "./api/v1/routes/userRoutes";
import { accessLogger, errorLogger, consoleLogger } from "./api/v1/middleware/logger";
import authenticate from "./api/v1/middleware/authenticate";
import { authorize as isAuthorized } from "./api/v1/middleware/authorize";


// Initialize Express application
const app: Express = express();
app.use(express.json());

// Apply loggers
if (process.env.NODE_ENV !== "production") {
  app.use(consoleLogger);
}
app.use(accessLogger);
app.use(errorLogger);

// Define a route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/api/v1/admin", authenticate, isAuthorized({ hasRole: ["manager", "admin"] }),userRoutes);
app.use("/api/v1/loans", authenticate, loanRoutes);
app.use("/api/v1/loans", loanRoutes);

app.use(errorHandler);

export default app;