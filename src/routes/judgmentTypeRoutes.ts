import { Router } from "express";
import { JudgmentTypeController } from "../controllers/judgmentTypeController";
import { addJugmentSchema } from "../DTOs/JudgmentTypeDtos";
import { validate } from "../middlewares/validation";

const router = Router();
const judgmentTypeController = new JudgmentTypeController();

router.post("/add", validate(addJugmentSchema) ,judgmentTypeController.createJudgmentType);
router.get("/delete/:id", judgmentTypeController.delete);
router.get("/get-all", judgmentTypeController.getAll)

export default router;