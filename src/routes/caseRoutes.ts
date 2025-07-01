import { Router } from "express";
import { CaseController } from "../controllers/caseController";
import {authenticate} from "../middlewares/authenticate"



const router = Router()
const controler = new CaseController()



router.post('/get-cases-by-user-id', authenticate, controler.getCaseByUserId)
router.post('/get-case-info', controler.getCaseInfo)

export default router;