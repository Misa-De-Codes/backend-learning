import { asyncHandler } from "../utils/asyncHandler"
import { jwt } from "jsonwebtoken"
import User from "../models/user.model.js"

export const varifyjwt = asyncHandler( async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replae("Bearer", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }    
    
        const decodedToken = jwt.varify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            // disscuss about frontend 
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user; 
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
}) 




