import { Router } from "express";
import { CustomerCasesController } from "../controllers/customerCasesController";
import { authenticate} from "../middlewares/authenticate"




const router = Router()
const controller = new CustomerCasesController()


router.post('/add', authenticate, controller.addCustomerCases)
router.post('/get-customer-cases', authenticate , controller.getCustomerCases)



export default router;