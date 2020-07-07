import { Router } from "express";
import customer from "./customer";
import employee from "./employee";
import clothingtype from "./clothingtype";

const routes = Router();

routes.use("/customer", customer);
routes.use("/employee", employee);
routes.use("/clothing-type", clothingtype);

export default routes;
