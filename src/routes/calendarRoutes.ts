import { Router } from "express";
import {authenticate} from "../middlewares/authenticate"
import { CalendarController } from "../controllers/calendarController";



const router = Router();
const controller = new CalendarController()


router.post('/add-calendar',authenticate, controller.create)



export default router;