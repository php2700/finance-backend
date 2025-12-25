import { Router } from "express";
// import { authentication } from "../Middleware/authenticate.js";
// import { authorization } from "../Middleware/authorize.js";
import { AddTransction } from "../Controller/userController.js";

const userRouter=Router()

userRouter.post('/add-transaction',AddTransction)

export default userRouter;