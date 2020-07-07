import {Router} from "express";
import EmployeeController from "../controllers/EmployeeController";

const router = Router();
//Get all services
router.get("/", EmployeeController.listAll);
router.get("/:id", EmployeeController.getOneById);
router.post("/", EmployeeController.create);
router.put("/:id", EmployeeController.update);
router.delete("/:id", EmployeeController.delete);

export default router;