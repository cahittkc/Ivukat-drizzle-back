import { Router } from "express";
import { CustomController } from "../controllers/customController";


const router = Router();
const controller = new CustomController();


router.post('/case-and-parties-add', controller.addCaseAndParties)


export default router;