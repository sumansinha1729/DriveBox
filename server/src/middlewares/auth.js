import jwt from 'jsonwebtoken';

export const auth=(req,res,next)=>{
  const header=req.headers.authorization || '';
  const toekn=header.startsWith('Bearer') ? header.slice(7) : null

  if(!toekn) return res.status(401).json({message:"No toekn provided"});

  try {
    const payload=jwt.verify(toekn, process.env.JWT_SECRET);
    req.user={id:payload.id, email:payload.email};
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({message:"Invalid or expires token"});
  }
}