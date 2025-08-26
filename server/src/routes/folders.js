import express from 'express';
import Folder from '../models/Folder.js';
import { auth } from '../middlewares/auth.js';

router.post('/',auth, async(req,res)=>{
  try {
    const {name, parentId}=req.body;
    const folder=await Folder.create({name, parent:parentId || null, owner: req.user});
    res.status(201).json(folder);
  } catch (error) {
    const code=error.code===11000? 409 :500;
    res.status(code).json({message:"Create folder failed: ",error:error.message});
  }
});

// Listing folders under the parents
router.get('/path/:id', auth, async (req, res) => {
const path = [];
let curr = await Folder.findOne({ _id: req.params.id, owner: req.user.id });
if (!curr) return res.status(404).json({ message: 'Folder not found' });
while (curr) {
path.unshift({ id: curr._id, name: curr.name });
curr = curr.parent ? await Folder.findOne({ _id: curr.parent, owner: req.user.id }) : null;
}
res.json(path);
});

export default router;