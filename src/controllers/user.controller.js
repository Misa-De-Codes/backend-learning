import { asyncHandler } from "../utils/asyncHandler";

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // vat=lidation - not empty
    // check is user is already exist : both username and email
    // check for images and check for avater
    //uplload them for cloudinary, avater
    // create user objects - craete entry in bd
    // remove password and refresh token field from response
    // check for  user creation
    // return response
    
    
    const { fullName, emial, userName, password } = req.body
    console.log('email: ', emial)
})

export { registerUser }