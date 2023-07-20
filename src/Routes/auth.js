const {registerUser,loginUser,countUsers,displayUsers,displayUsersByID}=require("../controllers/UserController")
const express = require("express");
const router = express.Router();
router.route('/register').post((req,res)=>{
  registerUser(req,res)
});
router.route('/login').post((req,res)=>{
  loginUser(req,res)
});
router.route('/countUsers').get((req,res)=>{
  countUsers(req,res);
  
});
router.route('/display').get((req,res)=>{
  displayUsers(req,res)
});
router.route('/displaybyid/:user_id').get((req,res)=>{
  displayUsersByID(req,res)
}); 

module.exports = router;
 