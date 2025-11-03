import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import errorHandler from "../src/api/v1/middleware/errorHandler";
import { AppError } from "../src/api/v1/errors/errors";
import { HTTP_STATUS } from "../src/constants/httpConstants";

describe("Error Handling System", () => {

  // Arrange
  const testApp = express();

  testApp.get("/throw-app-error", (_req: Request, _res: Response, next: NextFunction) => {
    next(new AppError("Custom error triggered", HTTP_STATUS.BAD_REQUEST, "BAD_REQUEST"));
  });

  // Route that is use to throws a error
  testApp.get("/throw-generic-error", (_req: Request, _res: Response, next: NextFunction) => {
    next(new Error("Generic error occurred"));
  });

  // THat is  for  Applying the global error handler
  testApp.use(errorHandler);

  // Test 1 
  it("should format AppError with proper structure", async () => {
    
    //Act
    const res = await request(testApp).get("/throw-app-error");

    //Assert
    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toHaveProperty("message", "Custom error triggered");
    expect(res.body.error).toHaveProperty("code", "BAD_REQUEST");
  });

  //  Test 2 

  it("should return standardized 500 response for generic errors", async () => {
    const res = await request(testApp).get("/throw-generic-error");
    expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toBe("An unexpected error occurred");
  });

  // Test 3 

  it("should create AppError instance with correct values", () => {
    const err = new AppError("Not found", HTTP_STATUS.NOT_FOUND, "NOT_FOUND");
    expect(err.message).toBe("Not found");
    expect(err.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
    expect(err.code).toBe("NOT_FOUND");
    expect(err).toBeInstanceOf(AppError);
  });
});
