import { Router } from "express";
import {
  getAllLoans,
  createLoan,
  reviewLoan,
  approveLoan,
  getLoanById,
  deleteLoan,
} from "../controllers/loanController";

const router = Router();
router.get("/", getAllLoans);
router.post("/", createLoan)
router.put("/:id/review", reviewLoan);
router.put("/:id/approve", approveLoan);
router.delete("/:id", deleteLoan);
router.get("/:id", getLoanById);

export default router;
