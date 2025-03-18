import { asyncHandler } from "../utils/asyncHandler";
import { ApiError} from "../utils/ApiError";
import { User, user } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//
const generateAccessTokenAndRefereshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}

// 
// so this asynchandeler is nothing just a wrapper so it handles errors without needing to write many of-else statements.
// so we wrapped this wrapper on the top of our actual async controller function for error handeling
// this is a custom made async handeller so we can get better customizition in handeling the errors    
const registerUser = asyncHandler( async (req, res) => {
    /*  get user details from frontend
    vat=lidation - not empty ¬_¬ in production a saparate file is there for validation methods to call
    check is user is already exist : both username and email
    check for images and check for avater
    uplload them for cloudinary, avater
    create user objects - craete entry in bd
    remove password and refresh token field from response
    check for  user creation
    return response
    its better to console the whole request for better study */
    
    const { fullName, email, username, password } = req.body 
    // extracted all of the data-points form the req.body
    if ( 
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fieds are required!")
    } // make sure if they are not empty string

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    }) // if user already exist by this email or username

    if ( existedUser ) {
        throw new ApiError(409, "User with email or username is already exist!")
    } // error if it does exist

    const avaterLocalPath = req.files?.avatar[0]?.path; // found the local path
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if ( req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path   
    } // was bug fixed

    if (!avaterLocalPath) {
        throw new ApiError(400, "Avatar fille is required!")
    }

    const avater = await uploadOnCloudinary(avaterLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    // upload to it the cloudinary
    if (!avater) {
        throw new ApiError(400, "Avatar fille is required!")
    }

    const user = await User.create({
        fullName, 
        avater: avater.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    }) // create an object if everything is created and pushed by user.create()

    // we are not getting the password and refresh token in postman
    // we are removing the password and refresh token
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // if user not create then error if yes then res.status
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

//
const loginUser = asyncHandler(async (req, res) => {
    /* req bidy -> data
    username or email
    find the user
    if yes then check password and if wong
    then access and refresh token
    send coockies and a response of success
    */
   const {email, username, password} = req.body

   //checking if user already esits 
   if (!email || !username) {
        throw new ApiError(400, "username or emial is required!")
   }
   const user = await User.findOne({
    $or: [{username}, {email}]
   })
   if (!user) {
        throw new ApiError(404, "user doesnot exist!")
   }
   //checking if password is correct
   const isPasswordValid = await user.isPasswordCorrect(password);
   if (!isPasswordValid) {
        throw new ApiError(404, "Invalid user credencials!")
   }
   const {accessToken, refreshToken} = await generateAccessTokenAndRefereshToken(user._id);

   const logedInUser = await User.findById(user._id).select("-password -refreshToken")

   const options = { // now can only modifid by server now, so more secure
        httpOnly: true,
        secure: true
   }
   return res.status(200)
             .cookie("accessToken", accessToken, options)
             .cookie("refreshToken", refreshToken, options)
             .json(
                new ApiResponse(200,
                {
                    user: logedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )
    }
)

// 
const logoutUser = asyncHandler((req, res) => {
    
})



export { registerUser, loginUser }