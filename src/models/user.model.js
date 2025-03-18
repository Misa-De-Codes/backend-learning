import mongoose from "mongoose"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new schema({
    username : {
        type : String,
        required: true,
        lowerCase: true,
        unique: true,
        trim: true,
        index: true
    },
    emiail: {
        type : String,
        required: true,
        lowerCase: true,
        trim: true,
        unique: true
    },
    fullName : {
        type : String,
        required: true,
        trim: true,
        index: true
    },
    avatar : {
        type : String, // cloudnery url
        required: true,
    },
    coverImage : {
        type : String, //cloudniry url
    },
    watchHistory : [{
        type : Schema.Types.ObjectId,
        ref: "Vidoe"
    }],
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    refereshToken: {
        type: String
    },
}, {timestamps: true})

//checking the userSchema for modified password and then hashing
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();
})

// We are setting some functions inside the methids of mongoose schemas
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            _id: this._id, 
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        {
            _id: this._id, 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)  
