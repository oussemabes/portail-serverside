const dotenv = require("dotenv");
dotenv.config();
const jwt=require('jsonwebtoken')
const db = require("../config");
const { registerValidation,loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");

function checkIfUserExists(req) {
  return new Promise((resolve, reject) => {
    console.log("Checking if user exists");
    let sqlverif = "SELECT * FROM users WHERE email= ?";

    db.query(sqlverif, [req.body.email], (err, result) => {
      if (err) {
        throw err;
      }
      if (result.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}
async function registerUser(req, res) {
    // Validate data before creating a user
    console.log(req.body)
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
      
    }
  
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
    // Create new user
    const data = [req.body.name, req.body.email, hashedPassword,req.body.admin, req.body.age, req.body.chronic];
    const sql = "INSERT INTO users (name, email, Password, admin, age,chronic) VALUES (?,?,?,?,?,?)";
    const userExists = await checkIfUserExists(req);
    if (userExists === false) {
      await db.query(sql, data, function (err, result) {
        if (err) {
          console.error(err);
          return res.status(500).send("Error inserting user into the database");
        }
        res.status(200).send("User registered successfully");
      });
    } else {
      res.status(400).send("User with that information already exists");
    }
  }
  

async function loginUser(req,res){
  //validate data before login in a user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //

  const userExists = await checkIfUserExists(req);
  if (userExists == true) {
    //see if password matches
    function GetDbPassword() {
    return new Promise((resolve, reject) => {
      let sqlverif = "SELECT id,password FROM users WHERE email= ?";
      db.query(sqlverif, [req.body.email], (err, result) => {
        if (err) {
          throw err;
        }
        console.log(result);
        if (result.length > 0) {
          resolve({id:result[0].id,dbPassword:result[0].password});
        } else {
          resolve(false);
        }
      });
    });
  }
  const {id,dbPassword}=await GetDbPassword();
  const validPass=await bcrypt.compare(req.body.password,dbPassword)
  const validPassNotCrypted=req.body.password==dbPassword;
  console.log(dbPassword,req.body.password)
  if (validPass==false && validPassNotCrypted==false){
    res.status(400).send("password is wrong");
  }else{
    //create and assign token
    const token=jwt.sign({id:id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:600000000*2})
   

    res.header("auth-token",token).send(token);
   
  }
  } else {
    res.status(400).send("Email is wrong");
  }
}
async function displayUsers(req, res) {
  console.log("page", req.query.page, "limit", req.query.limit);
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const offset = (page - 1) * limit;
  try {
    const getData = `SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`;
    await db.query(getData, (err, result) => {
      if (err) {
        throw err;
      }
      res.send(result);
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ error: "Error retrieving data from the database" });
  }
}
async function countUsers(req,res){
  try{
    const getData="SELECT COUNT(*) as count FROM users"
    await db.query(getData,(err,result)=>{
      if (err){
        throw err;
      }
      res.send(result)
    });
  }catch (err){
    console.log(err);
    return res
    .status(500)
    .send({error:"Error retrieving data from the database"})
  }
}
module.exports={registerUser,loginUser,checkIfUserExists,countUsers,displayUsers}