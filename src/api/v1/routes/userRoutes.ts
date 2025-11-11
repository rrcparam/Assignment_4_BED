import express from "express";
import { getUserById, setUserRole } from "../controllers/userController";

const router = express.Router();

router.get("/users/:uid", getUserById);
router.post("/admin/set-role", setUserRole);

export default router;
