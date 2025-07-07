import { Router } from "express";
import { HearingController } from "../controllers/hearingController";


const router = Router()
const controller = new HearingController()


router.post('/get-hearings', controller.getHearingAndParties)


export default router;


