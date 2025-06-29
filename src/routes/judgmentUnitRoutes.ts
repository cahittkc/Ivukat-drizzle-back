import { Router } from "express";
import { JudgmentUnitController } from "../controllers/judgmentUnit";



const router = Router();

const controller = new JudgmentUnitController()


router.post('/add', controller.create)
router.get('/get-units-by-type-id/:id',controller.getJudgmentUnitByJudgmentTypeUyapId)



export default router;