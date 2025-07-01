import { Router } from "express";
import { validate } from "../middlewares/validation";
import { authenticate } from "../middlewares/authenticate";
import { loginSchema, registerSchema } from "../DTOs/authDto";
import { AuthController } from "../controllers/authController";

const router = Router();

const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/refresh-token', authenticate, authController.refreshToken);
router.get('/session', authenticate , authController.session)
router.get('/logout',  authController.logout);

export default router;