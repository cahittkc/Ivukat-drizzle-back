import { Router } from "express";
import { PartiesController } from "../controllers/partiesController";
import {authenticate} from "../middlewares/authenticate"


const router = Router();
const controller = new PartiesController()


router.get('/get-case-parties/:caseNo', authenticate , controller.getPartiesByCaseNo)



export default router;