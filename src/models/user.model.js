import mongoose from "mongoose"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"



const userSchema = new schema({
    userName : {
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
        required: true,

    },
    refereshToken: {
        type: String
    },
}, {timestamps: true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)