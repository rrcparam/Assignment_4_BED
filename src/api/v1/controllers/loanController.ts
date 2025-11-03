import { Request, Response } from "express";
import { Loan } from "../models/loan";

let loans: Loan[] = [
  { id: "L001", applicantName: "Arjan Dhillon", amount: 20000, status: "PENDING" },
  { id: "L002", applicantName: "Navan Sandhu", amount: 50000, status: "REVIEW" },
  { id: "L003", applicantName: "Karan Aujla", amount: 70000, status: "PENDING" },
  { id: "L004", applicantName: "Prem Dhillon", amount: 60000, status: "PENDING" },
];

// Its Purpose Retrieve all loan applications

export const getAllLoans = (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Loans retrieved successfully",
    data: loans,
  });
};

  
//Its Purpose is to Submit a new loan application

export const createLoan = (req: Request, res: Response) => {
     
  const { applicantName, amount } = req.body;

  if (!applicantName || !amount) {
    return res.status(400).json({
      success: false,
      message: "Applicant name and amount are required",
    });
  }

  const newLoan: Loan = {
    id: `L${(loans.length + 1).toString().padStart(3, "0")}`,
    applicantName,
    amount,
    status: "PENDING",
  };

  loans.push(newLoan);

  res.status(201).json({
    success: true,
    message: "Loan application created successfully",
    data: newLoan,
  });
};

/**
  Its Purpose is to Mark loan as in under review
 */
export const reviewLoan = (req: Request, res: Response) => {
  const { id } = req.params;
  const loan = loans.find((l) => l.id === id);

  if (!loan) {
    return res.status(404).json({ success: false, message: "Loan not found" });
  }

  loan.status = "REVIEW";

  res.status(200).json({
    success: true,
    message: "Loan moved to review stage",
    data: loan,
  });
};

/**
 Its Purpose for Approve or reject a loan
 */
export const approveLoan = (req: Request, res: Response) => {
  const { id } = req.params;
  const { decision } = req.body;

  const loan = loans.find((l) => l.id === id);

  if (!loan) {
    return res.status(404).json({ success: false, message: "Loan not found" });
  }

  if (!["APPROVED", "REJECTED"].includes(decision)) {
    return res
      .status(400)
      .json({ success: false, message: "Decision must be APPROVED or REJECTED" });
  }

  loan.status = decision as "APPROVED" | "REJECTED";

  res.status(200).json({
    success: true,
    message: `Loan ${loan.status.toLowerCase()} successfully`,
    data: loan,
  });
};

// Its purpose to retrieve a loan by its ID
export const getLoanById = (req: Request, res: Response): void => {
  const loan = loans.find((l) => l.id === req.params.id);

  if (!loan) {
    res.status(404).json({
      success: false,
      message: "Loan not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Loan retrieved successfully",
    data: loan,
  });
};

// This is for delete a loan
export const deleteLoan = (req: Request, res: Response): void => {
  const loanExists = loans.some((l) => l.id === req.params.id);

  if (!loanExists) {
    res.status(404).json({
      success: false,
      message: "Loan not found",
    });
    return;
  }

  loans = loans.filter((l) => l.id !== req.params.id);

  res.status(204).send(); 
};
