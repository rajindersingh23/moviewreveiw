const express = require("express");
const router = express.Router();
var con = require('../utils/db');
const bcrypt = require("bcryptjs");
const passwordComplexity = require("joi-password-complexity");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require('../utils/authUser')

router.post('/', async(req, res) => {
  const createUser = `
   CREATE TABLE IF NOT EXISTS users(
     userId INT(6) NOT NULL PRIMARY KEY,
     userName VARCHAR(255),
     firstName VARCHAR(255),
     lastName VARCHAR(255),
     email VARCHAR(255),
     password VARCHAR(1024)
   )`;

     con.query(createUser, (err, result) => {
       if (err) throw err;
       console.log('Table [users] created');
     });

 let id = Math.floor(100000 + Math.random() * 900000);
 let userName = req.body.userName;
 let firstName = req.body.firstName;
 let lastName = req.body.lastName;
 const salt = await bcrypt.genSalt(10);
 let password = await bcrypt.hash(req.body.password, salt);
 let email = req.body.email;
 let insertUser = `INSERT INTO users (userId, userName, firstName, lastName, email, password) VALUES (?,?,?,?,?,?)`;
 let checkUserName = `SELECT * FROM users WHERE userName = ?`;
 let checkEmail = `SELECT * FROM users WHERE email = ?`

 const { error } = validateUser(req.body);
if (error) return res.send({error: error.details[0].message});
else {

  con.query(checkEmail, email, (err, rest) => {
    if (err) {
    res.status(500).json({error: err.code})
    }else {
      if(rest.length === 0){

        con.query(checkUserName, email, (err, result) => {
          if (err) {
          res.status(500).json({error: err.code})
          }else {
            if(result.length === 0){

              con.query(insertUser,[id, userName, firstName, lastName, email, password], (err, result) => {
                if (err) {
                res.status(500).json({error: err.code})
                }else {
                  const token = jwt.sign(
                    {
                      userId: id,
                    userName,
                    firstName,
                    lastName,
                    email
                    },
                    config.get("jwtPrivateKey")
                  );
                  res.send({token: token})
               }
              })
            } else{
              res.send({error: "Username already taken"});
            }
          }
        })
      } else{
        res.send({error: "Email already taken"});
      }
    }
  })
}
})

router.get('/', auth, async(req, res) => {
  const createUser = `
     CREATE TABLE IF NOT EXISTS users(
       userId INT(6) NOT NULL PRIMARY KEY,
       userName VARCHAR(255),
       firstName VARCHAR(255),
       lastName VARCHAR(255),
       email VARCHAR(255),
       password VARCHAR(1024)
     )`;
 
       con.query(createUser, (err, result) => {
         if (err) throw err;
         console.log('Table [users] created');
       });

 let getUser = `SELECT * FROM users WHERE userId = ?`;
  con.query(getUser, req.user.userId, (err, result) => {
      if (err) {
      res.status(500).json({error: err.code})
      }else {
        res.send(result)
         }
     });
})

router.put('/', auth, async(req, res) => {
  const createUser = `
   CREATE TABLE IF NOT EXISTS users(
     userId INT(6) NOT NULL PRIMARY KEY,
     userName VARCHAR(255),
     firstName VARCHAR(255),
     lastName VARCHAR(255),
     email VARCHAR(255),
     password VARCHAR(1024)
   )`;

     con.query(createUser, (err, result) => {
       if (err) throw err;
       console.log('Table [users] created');
     });

     let firstName = req.body.firstName;
     let lastName = req.body.lastName;
    let userId = req.user.userId;
   let editUser = `UPDATE users SET firstName = ?, lastName = ? WHERE userId = ?`;
  con.query(editUser, [firstName, lastName, userId], (err, result) => {
      if (err) {
      res.status(500).json({error: err.code})
      }else {
        res.send(result)
         }
     });
})

 function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().max(50).required(),
        userName: Joi.string().min(5).max(50).required().alphanum(),
        email: Joi.string().min(5).max(200).required().email(),
        password: passwordComplexity({
        min: 8,
        max: 25,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 4,
        }).required()
    });
  
    return schema.validate(user);
  }

 module.exports = router;