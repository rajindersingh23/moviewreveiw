const express = require("express");
const router = express.Router();
var con = require('../utils/db');
const bcrypt = require("bcryptjs");
const passwordComplexity = require("joi-password-complexity");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");

router.post('/user', async(req, res) => {

    const { error } = validate(req.body);
    if (error) return res.send({error: error.details[0].message});

    con.query(`SELECT * FROM users WHERE email=?`,req.body.email, (err, result) => {
        if(err) return res.status(401).send({error: err})
        else {
            if(result.length === 0) return res.status(401).send("Invalid email or password")
            else {
                const validPassword = bcrypt.compareSync(req.body.password, result[0].password);
                if (!validPassword) return res.status(401).send("Invalid email or password")
                else{
                    const token = jwt.sign(
                        {
                        userId: result[0].userId,
                        userName: result[0].userName,
                        email: result[0].email,
                        firstName: result[0].firstName,
                        lastName: result[0].lastName
                    },
                        config.get("jwtPrivateKey")
                      );
                      res.send({token: token})
                }
            }
        }
    })
});

router.post('/admin', async(req, res) => {

    const { error } = validate(req.body);
    if (error) return res.send({error: error.details[0].message});

    con.query(`SELECT * FROM admin WHERE email=?`,req.body.email, (err, result) => {
        if(err) return res.status(401).send({err: "Email not found"})
        else {
            if(result.length === 0) return res.status(401).send({error: "Invalid email or password"})
            else {
                const validPassword = bcrypt.compareSync(req.body.password, result[0].password);
                if (!validPassword) return res.status(401).send({error: "Invalid email or password"})
                else{
                    const token = jwt.sign(
                        {adminId: result[0].adminId,
                        email: result[0].email,
                        firstName: result[0].firstName,
                        lastName: result[0].lastName},
                        config.get("jwtPrivateKey")
                      );
                      res.send({token: token})
                }
            }
        }
    })
});

 function validate(user) {
    const schema = Joi.object({
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