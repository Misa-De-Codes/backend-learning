import { json, Router } from "express";
import { registerUser } from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

// Setting the router for the user registration 
// this is an independent app that is a mini app. so later we need to give it's access to app.use('/', router)
// to actully use it
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "cover", maxCount: 1 },
    ]),
    registerUser)

export default router