import { Router } from "express";
import { CustomerController } from "../controllers/customerController";
import {authenticate} from "../middlewares/authenticate"
import {validate} from "../middlewares/validation"
import { newCustomerSchema } from "../DTOs/customerDtos";



const router = Router()
const controller = new CustomerController()


router.post('/add-customer', authenticate, validate(newCustomerSchema), controller.createCustomer)



export default router;