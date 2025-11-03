import express, { Express } from "express";
import loanRoutes from "./api/v1/routes/loanRoutes";
import errorHandler from "./api/v1/middleware/errorHandler";


// Initialize Express application
const app: Express = express();
app.use(express.json());

// Define a route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/api/v1/loans", loanRoutes);
app.use(errorHandler);

export default app;