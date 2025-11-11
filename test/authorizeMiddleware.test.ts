import { Request, Response, NextFunction } from "express";
import { authorize } from "../src/api/v1/middleware/authorize";


describe("Authorization Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      params: { id: "user123" },
    };
    mockRes = {
      locals: { uid: "user123", role: "officer" },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {}); 
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // 1 iT would be  Missing user role
  it("should deny access if user role is missing", () => {
    mockRes!.locals!.role = undefined;

    const middleware = authorize({ hasRole: ["admin", "officer"] });
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
   expect(mockRes.json).toHaveBeenCalledWith(
  expect.objectContaining({
    success: false,
    error: expect.objectContaining({
      code: "FORBIDDEN_ACCESS",
      message: "Forbidden: Access denied",
    }),
  })
);

    expect(mockNext).not.toHaveBeenCalled();
  });

  // 2 It would allowvSameUser  should pass if user accesses own data
  it("should allow access when allowSameUser is true and user matches target", () => {
    const middleware = authorize({ allowSameUser: true });
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  //   Insufficient role permissions

  it("should deny access for insufficient role", () => {
    const middleware = authorize({ hasRole: ["manager"] }); 
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith(
  expect.objectContaining({
    success: false,
    error: expect.objectContaining({
      code: "FORBIDDEN_ACCESS",
      message: "Forbidden: Access denied",
    }),
  })
);

    expect(mockNext).not.toHaveBeenCalled();
  });

  // proper role can pass
  it("should allow access when user has required role", () => {
    const middleware = authorize({ hasRole: ["officer", "manager"] });
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
