import express, { Request, Response } from "express";
import request from "supertest";
import fs from "fs";
import { accessLogger, errorLogger, consoleLogger } from "../src/api/v1/middleware/logger";


jest.mock("fs", () => ({
  existsSync: jest.fn(() => true),
  mkdirSync: jest.fn(),
  createWriteStream: jest.fn(() => ({
    write: jest.fn(),
  })),
  appendFileSync: jest.fn(),
}));

describe("Logging Middleware Configuration", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(consoleLogger);
    app.use(accessLogger);
    app.use(errorLogger);

    app.get("/ok", (_req: Request, res: Response) => {
      res.status(200).send("OK");
    });

    app.get("/error", (_req: Request, res: Response) => {
      res.status(404).send("Not Found");
    });
  });

  it("should log successful requests without crashing", async () => {
    const res = await request(app).get("/ok");
    expect(res.status).toBe(200);
    expect(fs.appendFileSync).not.toHaveBeenCalledWith(expect.stringContaining("error.log"));
  });

  it("should log error requests to error.log", async () => {
    const res = await request(app).get("/error");
    expect(res.status).toBe(404);
    expect(fs.appendFileSync).toHaveBeenCalled();
  });
});
