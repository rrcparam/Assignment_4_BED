import app from "./app";
import { Server } from "http";
import loanRoutes from "./api/v1/routes/loanRoutes";
import  errorHandler from "./api/v1/middleware/errorHandler";

// Root test route
app.get("/", (_req, res) => res.send("API is working!"));

// loan routes
app.use("/api/v1/loans", loanRoutes);

app.use(errorHandler);

const PORT: string | number = process.env.PORT || 3000;

const server: Server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);


});

export { server };