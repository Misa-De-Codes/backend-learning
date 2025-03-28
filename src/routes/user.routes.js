import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware.js";

// Setting the router for the user registration 
// this is an independent app that is a mini app. so later we need to give it's access to app.use('/', router)
// to actully use it
const router = Router()
router.route("/register").post(
    upload.fields([
        { 
            name: "avatar",
            maxCount: 1 
        },
        {
            name: "cover",
            maxCount: 1
        },
    ]),
    registerUser
)



//secured rorutes 
router.route("/login").post(varifyJWT, loginUser)

export default router