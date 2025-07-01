import { Router } from "express";
import { ClientController } from "../controllers/clientsController";
import { authenticate } from "../middlewares/authenticate";



const router =  Router()
const controller = new ClientController()


router.post('/get-clients',authenticate , controller.getClientByUserId )


export default router;