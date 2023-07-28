const {registerUser,loginUser,countUsers,displayUsers,displayUsersByID,VerifyToken,VerifyAdmin}=require("../controllers/UserController")
const express = require("express");
const router = express.Router();
router.route('/register').post((req,res)=>{
  registerUser(req,res)
});
router.route('/login').post((req,res)=>{
  loginUser(req,res)
}); 
router.route('/countUsers').get(VerifyToken,VerifyAdmin,(req,res)=>{
  countUsers(req,res);
});
router.route('/display').get(VerifyToken,VerifyAdmin,(req,res)=>{
  displayUsers(req,res)
});
router.route('/displaybyid/:user_id').get(VerifyToken,(req,res)=>{
  displayUsersByID(req,res)
});  // 
     
module.exports = router; 
     