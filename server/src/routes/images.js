import express from 'express';
import multer from 'multer';
import { auth } from '../middlewares/auth';
import Image from '../models/Image';
import cloudinary from '../utis/cloudinary';

const router=express.Router();
const upload=multer({storage:multer.memoryStorage()});

// upload an image to cloudinary and stor metadada
router.post('/upload', auth, upload.single('image'), async(req,res)=>{
  try {
    const {name, folderId=null}=req.body;
    if(!req.file) return res.status(401).json({message:"Image file is required"});

    const steamUpload=(buffer)=> new Promise((resolve, reject)=>{
      const stream=cloudinary.uploader.upload_stream(
        {folder:'DriveBox'},
        (error, result)=>(error? reject(error) : resolve(result))
      );
      stream.end(buffer);
    });

    const result=await streamUpload(req.files.buffer);
    const doc=await Image.create({
      name,
      folder:folderId || null,
      owner: req.user.id,
      url: result.secure_url,
      publicId:result.public_id
    })
  } catch (error) {
   res.status(500).json({message:"upload failed", error:error.message}) 
  }
});

// search by name
router.get('/search', auth, async(req,res)=>{
  const {q=''}= req.query;
  const regex=new RegExp(q, 'i');
  const imgs=await Image.find({owner:req.user.id, name:regex}).sort({createdAt: -1});
  res.json(imgs);
});

export default router