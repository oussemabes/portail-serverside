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
    const data = [req.body.ref,req.body.name, req.body.email, hashedPassword,req.body.admin, req.body.age, req.body.gender];
    const sql = "INSERT INTO users (ref,name, email, Password, admin, age,gender) VALUES (?,?,?,?,?,?,?)";
    const userExists = await checkIfUserExists(req);
    if (userExists === false) {
      await db.query(sql, data, function (err, result) {
        if (err) {
          console.error(err);
          return res.status(500).send("Error inserting user into the database");
        }
        console.log(result.insertId)
        res.status(200).send({ message: "User registered successfully", userId: result.insertId });
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
      let sqlverif = "SELECT id,password,ref FROM users WHERE email= ?";
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
  const {id,dbPassword,ref}=await GetDbPassword();
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
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const offset = Math.ceil((page - 1) * limit);
  try {
    const getData = `SELECT * FROM users WHERE admin="false" LIMIT ${limit} OFFSET ${offset}`;
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
async function displayUsersByID(req, res) {
  const user_id=req.params.user_id
  try {
    const getData = `SELECT * FROM users WHERE id= ${user_id}`;
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
    const getData=`SELECT COUNT(*) as count FROM users WHERE admin="false"`
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
function VerifyToken(req,res,next) {
  const token=req.header('Authorization');
  
  if(!token) return res.status(401).send('Access Denied');
  try{
      const verified = jwt.verify(token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET);
      console.log(verified)
      req.user=verified;
      
      next()
  }catch(err){
    console.log(token)
      res.status(400).send('Invalid Token');
  }

}
async function VerifyAdmin(req, res, next) {
  const token = req.header('Authorization');
  const verified = jwt.verify(token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET);
  const userId = verified.id;

  try {
    const getData = `SELECT admin FROM users WHERE id = ${userId}`;
    await db.query(getData, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ error: "Error retrieving data from the database" });
      }

      const isAdmin = result[0].admin;
      console.log(isAdmin)
      if (isAdmin==="false") {
        return res.status(403).send('Access Forbidden. User is not an admin.');
      }

      // Call next middleware only if the user is an admin
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Error retrieving data from the database" });
  }
}

module.exports={registerUser,loginUser,checkIfUserExists,countUsers,displayUsers,displayUsersByID,VerifyToken,VerifyAdmin} 