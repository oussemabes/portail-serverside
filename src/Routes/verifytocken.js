const jwt=require('jsonwebtoken');
const express = require("express");
const router = express.Router();
function auth(req,res,next) {
    const token=req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');
    try{
        const verified=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        req.user=verified;
        next()
    }catch(err){
        res.status(400).send('Invalid Token');
    }

}
router.route('/').get(auth,(req,res)=>{
    res.send(req.user)
  })
  module.exports = router;
 