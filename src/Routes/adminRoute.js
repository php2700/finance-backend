import { Router } from "express";
import { Login } from "../Controller/adminController.js";

const adminRouter=Router()

adminRouter.post('/login',Login)

export default adminRouter;