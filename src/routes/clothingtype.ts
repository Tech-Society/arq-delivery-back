import {Router} from "express";
import ClothingTypeController from "../controllers/ClothingTypeController";

const router = Router();
//Get all services
router.get("/", ClothingTypeController.listAll);
router.get("/:id", ClothingTypeController.getOneById);
router.post("/", ClothingTypeController.create);
router.put("/:id", ClothingTypeController.update);
router.delete("/:id", ClothingTypeController.delete);

export default router;