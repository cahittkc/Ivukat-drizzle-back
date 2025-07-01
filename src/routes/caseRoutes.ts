import { Router } from "express";
import { CaseController } from "../controllers/caseController";



const router = Router()
const controler = new CaseController()



router.post('/get-cases-by-user-id', controler.getCaseByUserId)
router.post('/get-case-info', controler.getCaseInfo)

export default router;