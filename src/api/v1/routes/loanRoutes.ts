import { Router } from "express";
import {
  getAllLoans,
  createLoan,
  reviewLoan,
  approveLoan,
  getLoanById,
  deleteLoan,
} from "../controllers/loanController";
import authenticate from "../middleware/authenticate"; 
import { authorize } from "../middleware/authorize";


const router = Router();
router.get(
  "/",
  authenticate,
  authorize({ hasRole: ["officer", "reviewer", "admin"] }), getAllLoans);

router.post(
  "/",
  authenticate,
  authorize({ hasRole: ["officer", "admin"] }),
   createLoan)

router.put("/:id/review",
   authenticate,
  authorize({ hasRole: ["reviewer", "officer", "admin"] }),
   reviewLoan);

router.put(
  "/:id/approve",
   authenticate,
   authorize({ hasRole: ["admin"] }),
   approveLoan);

router.delete(
  "/:id",
   authenticate,
  authorize({ hasRole: ["admin"] }), deleteLoan);
  
router.get("/:id",
  authenticate,
  authorize({ hasRole: ["officer", "reviewer", "admin"] }), getLoanById);

export default router;
