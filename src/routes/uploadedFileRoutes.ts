import { Router } from "express";
import { UploadedFileController } from "../controllers/uploadedFileController";
import { upload } from "../middlewares/upload";
import { authenticate } from "../middlewares/authenticate"




const router = Router()

const controller = new UploadedFileController()

router.post("/upload", upload.single("file"), controller.uploadAndSave);
router.post('/get-customer-files', authenticate, controller.getCustomerFiles)
router.post('/dowloand-file', authenticate, controller.dowloandFile)



export default router;