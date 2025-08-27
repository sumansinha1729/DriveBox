import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema=new Schema({
  name:{type:String, required:true},
  email:{type:String, required: true, lowercase: true, unique: true},
  passsword:{type:String, required: true, minLength: 6}
},
{timestamps: true}
);

userSchema.pre('save', async function(next){
  if(!this.passsword.isModified) return next();
  const salt=await bcrypt.genSalt(10);
  this.passsword=await bcrypt.hash(this.passsword, salt);
  next();
});

userSchema.methods.comparePassword=function(candidate){
  return bcrypt.compare(candidate, this.passsword);
};

export default mongoose.model("User",userSchema);