import { Router } from "express";
import { allModels, uploadModel } from "./controller.js";
import { upload } from "./utils/multer.js";

const router = Router()

router.post("/upload-model", upload.single("file"), uploadModel)
router.get("/all-models", allModels)

export default router
