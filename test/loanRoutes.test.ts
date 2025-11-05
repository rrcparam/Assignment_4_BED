import request from "supertest";
import app from "../src/app";


jest.mock("../src/api/v1/middleware/authenticate", () => ({
  __esModule: true,
  default: jest.fn((_req, _res, next) => next()),
}));

describe("Loan API Endpoints ", () => {
  it("GET /api/v1/loans → should return all loans", async () => {
   
    // Arrange
    const endpoint = "/api/v1/loans";

    // Act
    const res = await request(app).get(endpoint);

    //Assert
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /api/v1/loans → should create a new loan", async () => {
    
    
    //Arrange
    const endpoint = "/api/v1/loans";
    const newLoan = { applicantName: "Test User", amount: 10000 };

    // Act
    const res = await request(app).post(endpoint).send(newLoan);

    // Assert
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("PENDING");
    expect(res.body.data.applicantName).toBe(newLoan.applicantName);
  });

  it("PUT /api/v1/loans/:id/review → should move loan to review", async () => {
    
    // Arrange
    const loanId = "L001";
    const endpoint = `/api/v1/loans/${loanId}/review`;

    // Act
    const res = await request(app).put(endpoint);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("REVIEW");
  });

  it("PUT /api/v1/loans/:id/approve → should approve loan", async () => {
    
    // Arrange
    const loanId = "L002";
    const endpoint = `/api/v1/loans/${loanId}/approve`;
    const decision = { decision: "APPROVED" };

    // Act
    const res = await request(app).put(endpoint).send(decision);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("APPROVED");
  });
});

it("GET /api/v1/loans/:id → should return a loan by ID", async () => {
  // Arrange
  const loanId = "L001";
  const endpoint = `/api/v1/loans/${loanId}`;

  // Act
  const res = await request(app).get(endpoint);

  // Assert
  expect(res.status).toBe(200);
  expect(res.body.data.id).toBe(loanId);
  expect(res.body.success).toBe(true);
  expect(res.body.message).toBe("Loan retrieved successfully");
});

it("DELETE /api/v1/loans/:id → should delete a loan", async () => {
  // Arrange
  const loanId = "L001";
  const endpoint = `/api/v1/loans/${loanId}`;

  // Act
  const res = await request(app).delete(endpoint);

  // Assert
  expect(res.status).toBe(204);
});

