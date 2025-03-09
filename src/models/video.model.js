import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";




const vidoeSchema = new Schema({
    videoFile : {
        type: String, //cloudnirry uri
        required: true
    }, 
    thumbnail:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    discription:{
        type: String,
        required: true
    },
    duration:{
        type: Number, // clooudnary uri
        required: true
    },
    views:{
        type: Number,
        default: 0
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})



vidoeSchema.plugin(mongooseAggregatePaginate)



export const Vidoe = mongoose.model("Vidoe", vidoeSchema)

