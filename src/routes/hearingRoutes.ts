import { Router } from "express";
import { HearingController } from "../controllers/hearingController";


const router = Router()
const controller = new HearingController()


router.post('/get-hearings-and-parties', controller.getHearingAndParties)
router.post('/get-hearings', controller.getHearings)


export default router;


