import  { model,  Schema } from "mongoose";

const userSchema= new Schema({
    name:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String,
        unique:true
    },
    password:{
        required:true,
        type:String
    },
   profile: {
    required:true,
    type:String
    },
    publicId:{
        required:true,
        type:String
    },
    favourites:[
        {
            type: Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    disliked:[
        {
            type: Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    refreshToken:{
        type:String,
        
    }
},{
    timestamps:true
})
export const User= model("User", userSchema)