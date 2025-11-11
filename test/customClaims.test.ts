import { auth } from "../src/config/firebaseConfig";
import { setUserRole, getUserById } from "../src/api/v1/controllers/userController";
import { Request, Response } from "express";


jest.mock("../src/config/firebaseConfig", () => ({
  auth: {
    setCustomUserClaims: jest.fn(),
    getUser: jest.fn(),
  },
}));

describe("Firebase Custom Claims - Role Management", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should set custom claims successfully", async () => {

    // ARrange

    mockReq.body = { uid: "123", role: "officer" };

    // Mock Firebase Admin

    (auth.setCustomUserClaims as jest.Mock).mockResolvedValueOnce(undefined);

    // Act
    await setUserRole(mockReq as Request, mockRes as Response);

    // Assert
    expect(auth.setCustomUserClaims).toHaveBeenCalledWith("123", { role: "officer" });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
      })
    );
  });

  it("should fetch user with custom claims", async () => {

    // Arrange

    mockReq.params = { uid: "123" };

    (auth.getUser as jest.Mock).mockResolvedValueOnce({
      uid: "123",
      customClaims: { role: "manager" },
    });

    // Act

    await getUserById(mockReq as Request, mockRes as Response);

    // Assert
    expect(auth.getUser).toHaveBeenCalledWith("123");
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
      })
    );
  });

  it("should handle errors when setting claims fails", async () => {

    // Arrange
    mockReq.body = { uid: "123", role: "officer" };

    (auth.setCustomUserClaims as jest.Mock).mockRejectedValueOnce(
      new Error("Firebase failure")
    );

    // ACt
    await setUserRole(mockReq as Request, mockRes as Response);

    // Assert
    expect(auth.setCustomUserClaims).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );
  });
});
