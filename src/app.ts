import express, { Application, Request, Response } from "express";
import httpStatus from "http-status";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import router from "./routes";


const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "RentNest API is running 🚀",
  });
});


app.get("/api/v1", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "RentNest API is running 🚀",
  });
});


// routes
app.use("/api/v1",router);


// not found
app.use(notFound);

// global error handler
app.use(globalErrorHandler);



export default app;