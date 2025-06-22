import { Router } from "express";
import { validate } from "../middlewares/validation";
import { registerSchema } from "../DTOs/authDto";
import { AuthController } from "../controllers/authController";

const router = Router();

const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);

export default router;