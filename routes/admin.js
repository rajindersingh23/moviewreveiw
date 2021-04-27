const express = require("express");
const router = express.Router();
var con = require('../utils/db');
const bcrypt = require("bcryptjs");
const passwordComplexity = require("joi-password-complexity");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require('../utils/authAdmin')


router.post('/', async(req, res) => {
  const createAdmin = `
   CREATE TABLE IF NOT EXISTS admin(
     adminId INT(6) NOT NULL PRIMARY KEY,
     firstName VARCHAR(255),
     lastName VARCHAR(255),
     email VARCHAR(255),
     password VARCHAR(1024)
   )`;

     con.query(createAdmin, (err, result) => {
       if (err) throw err;
       console.log('Table [admin] created');
     });

 let id = Math.floor(100000 + Math.random() * 900000);
 let firstName = req.body.firstName;
 let lastName = req.body.lastName;
 const salt = await bcrypt.genSalt(10);
 let password = await bcrypt.hash(req.body.password, salt);
 let email = req.body.email;
 let insertUser = `INSERT INTO admin (adminId, firstName, lastName, email, password) VALUES (?,?,?,?,?)`;
 let searchAdmin = `SELECT * FROM admin WHERE email = ?`

 const { error } = validateUser(req.body);
if (error) return res.send({error: error.details[0].message});
else {
  con.query(searchAdmin, email, (err, rest) => {
    if (err) {
      res.status(500).json({error: err.code})
      } else {
        if(rest.length === 0){
          con.query(insertUser,[id, firstName, lastName, email, password], (err, result) => {
            if (err) {
            res.status(500).json({error: err.code})
            }else {
              const token = jwt.sign(
                {adminId: id,
                  firstName,
                  lastName,
                  email},
                config.get("jwtPrivateKey")
              );
              res.send({token: token})
               }
           });
      } else{
        res.send({error: "Email already taken"});
      }
    }
  })
}
})

router.get('/', auth, async(req, res) => {
  const createAdmin = `
   CREATE TABLE IF NOT EXISTS admin(
     adminId INT(6) NOT NULL PRIMARY KEY,
     firstName VARCHAR(255),
     lastName VARCHAR(255),
     email VARCHAR(255),
     password VARCHAR(1024)
   )`;

     con.query(createAdmin, (err, result) => {
       if (err) throw err;
       console.log('Table [admin] created');
     });

 let getAdmin = `SELECT * FROM admin WHERE adminId = ?`;
  con.query(getAdmin, req.admin.adminId, (err, result) => {
      if (err) {
      res.status(500).json({error: err.code})
      }else {
        res.send(result)
         }
     });
})

router.put('/', auth, async(req, res) => {
  const createAdmin = `
   CREATE TABLE IF NOT EXISTS admin(
     adminId INT(6) NOT NULL PRIMARY KEY,
     firstName VARCHAR(255),
     lastName VARCHAR(255),
     email VARCHAR(255),
     password VARCHAR(1024)
   )`;

     con.query(createAdmin, (err, result) => {
       if (err) throw err;
       console.log('Table [admin] created');
     });

    let adminId = req.admin.adminId;
   let firstName = req.body.firstName;
   let lastName = req.body.lastName;
   let editAdmin = `UPDATE admin SET firstName = ?, lastName = ? WHERE adminId = ?`;
  con.query(editAdmin, [firstName, lastName, adminId], (err, result) => {
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
        email: Joi.string().min(5).max(200).required().email(),
        password: passwordComplexity({
        min: 8,
        max: 25,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 4,
        }).required(),
    });
  
    return schema.validate(user);
  }

 module.exports = router;