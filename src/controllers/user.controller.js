import { asyncHandler } from "../utils/asyncHandler";
import { ApiError} from "../utils/ApiError";
import { User, user } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // vat=lidation - not empty ¬_¬ in production a saparate file is there for validation methods to call
    // check is user is already exist : both username and email
    // check for images and check for avater
    //uplload them for cloudinary, avater
    // create user objects - craete entry in bd
    // remove password and refresh token field from response
    // check for  user creation
    // return response
    
    const { fullName, email, userName, password } = req.body
    console.log('email: ', emial)

    if (
        [fullName, email, userName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fieds are required!")
    }

    const existedUser = User.findOne({
        $or: [{ userName }, { email }]
    })

    if ( existedUser ) {
        throw new ApiError(409, "User with email or username is already exist!")
    }

    const avaterLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avaterLocalPath) {
        throw new ApiError(400, "Avatar fille is required!")
    }

    const avater = await uploadOnCloudinary(avaterLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avater) {
        throw new ApiError(400, "Avatar fille is required!")
    }

    const user = await User.create({
        fullName, 
        avater: avater.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if ( !createdUser ) {
        throw new ApiError(500, "Something went wwrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successffully.")
    )

/*    if (fullName === "") {
        throw new ApiError(400, "Full Name is required!")
    }
*/
})

export { registerUser }