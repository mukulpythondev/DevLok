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
        // required:true,
        type:String
    },
   profile: {
    required:true,
    type:String
    },
    publicId:{
        // required:true,
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
    linkedinUrl: {
        type:String
    },
    refreshToken:{
        type:String,
        
    },
    bio:{
        type:String,
        maxlength:50
    },
    googleId:{
        type:String
    },
    // publicKey: {
    //     n: { type: String, required: true }, // RSA Modulus (n)
    //     e: { type: String, required: true }  // RSA Exponent (e)
    //   },
    otp: { type: String }, 
     otpExpiresAt: { type: Date },
     isVerified: {
        type: Boolean,
        default: false
      }
},{
    timestamps:true
})
export const User= model("User", userSchema)