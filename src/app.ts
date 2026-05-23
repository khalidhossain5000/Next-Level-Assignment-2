import express, { type Request, type Response } from "express";
import { issueRoute } from "./modules/issue/issue.route";
import globalErrorHandler from "./utilis/globalErrorHandler";
import { authRoute } from "./modules/auth/auth.route";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(
  cors({
    // origin: "http://localhost:5000",
    // origin:"https://next-level-assignment-2-zeta.vercel.app/"
  }),
);
app.get("/", async (req: Request, res: Response) => {
  res.send("Next level assignment backend server is running");
});

//auth realted setup

app.use("/api/auth", authRoute);

//issue realted api

app.use("/api/issues", issueRoute);

//global error
app.use(globalErrorHandler);
export default app;
