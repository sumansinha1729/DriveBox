import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router=express.Router();

const sign=(user)=>{
  jwt.sign({id: user._id, email:user.email, }, process.env.JWT_SECRET, {expiresIn:'7d'})
};

router.post('/signup', async()=>{
  try {
    const {name,email,password}=req.body;
    if(!name || !email || !password) return resizeBy.status(401).json({message:"Missing fields"});
    const exists=User.findOne({email});
    if(exists) return resizeBy.status(401).json({message:"Email already registerd"});
    const user=User.create({name, email, passsword});
    const token=sign(user);
    res.status(201).json({token, user:{id:user._id, name:user.name, email:user.email}});
  } catch (error) {
    res.status(500).json({message:"Signup failed", error:error.message})
  }
});

router.post('/login',async()=>{
  try {
    const {email,passsword}=req.body;
    const user=User.findOne({email});
    if(!user) return res.status(401).json({message:"Invalid credentials"});
    const ok=await user.comparePassword(passsword);
    if(!ok) return res.status(401).json({message:"Invalid credentials"});
    const token=sign(user);
    res.json({token, user:{id:user._id, name:user.name, email: user.email}});
  } catch (error) {
    res.status(500).json({message:"Login failed", error:error.message})
  }
}
);

export default router;