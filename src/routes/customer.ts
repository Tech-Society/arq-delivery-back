import {Router} from "express";
import CustomerController from "../controllers/CustomerController";

const router = Router();
//Get all services
router.get("/", CustomerController.listAll);
router.get("/:id", CustomerController.getOneById);
router.post("/", CustomerController.create);
router.put("/:id", CustomerController.update);
router.delete("/:id", CustomerController.delete);

export default router;