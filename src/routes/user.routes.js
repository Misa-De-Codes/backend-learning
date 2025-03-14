import { json, Router } from "express";
import { registerUser } from "../controllers/user.controller";
const router = Router()

// Setting the router for the user registration 
// this is an independent app that is a mini app. so later we need to give it's access to app.use('/', router)
// to actully use it
router.route("/register").post(registerUser)

export default router