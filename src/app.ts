import express, { Application, Request, Response } from "express";
import httpStatus from "http-status";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({ message: "RentNest Server is running" });
});

export default app;