import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ROLES = ["viewer","analyst","admin"];
const userSchema = new mongoose.Schema(
{
fullName: {
      type: String,
      required: true,
      minLength: 3
    },
    email:{
      type: String,
      required: true,
      unique: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
        
    },
     role: {
      type: String,
      enum: {values: ROLES},
      default: "viewer",
    },
    isActive:{
        type: Boolean,
        default: true
    }
},{timestamps:true}
);
const User = mongoose.model("User", userSchema);
export default User;