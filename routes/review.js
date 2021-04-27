const express = require("express");
const router = express.Router();
var con = require('../utils/db');
const auth = require('../utils/authUser')
const Joi = require("joi");

router.post('/:id', auth, async(req, res) => {
    const createReview = `
     CREATE TABLE IF NOT EXISTS reviews(
       reviewId INT(6) NOT NULL PRIMARY KEY,
       movieId INT(6),
       userId INT(6),
       userName VARCHAR(255),
       firstName VARCHAR(255),
       lastName VARCHAR(255),
        review VARCHAR(2048)
     )`;
 
       con.query(createReview, (err, result) => {
         if (err) throw err;
         console.log('Table [jobs] created');
       });

   let id = Math.floor(100000 + Math.random() * 900000);
   let movieId = parseInt(req.params.id);
   let userId = req.user.userId;
   let userName = req.user.userName;
   let firstName = req.user.firstName;
   let lastName = req.user.lastName;
   let review = req.body.review;
   let insertReview = `INSERT INTO reviews (reviewId, movieId, userId, userName, firstName, lastName, review) VALUES (?,?,?,?,?,?,?)`;

   const { error } = validateReview(req.body);
  if (error) return res.send({error: error.details[0].message})
  else{
            con.query(insertReview, [id, movieId, userId, userName, firstName, lastName, review], (err, result) => {
              if (err) {
              res.status(500).json({error: err.code})
              }else {
                res.send('Success')
                 }
             });
            }
 });

 function validateReview(obj) {
    const schema = Joi.object({
        review: Joi.string().min(1).max(2048).required()
    });
  
    return schema.validate(obj);
  }

  router.get('/user/:id', auth, async(req, res) => {
    const createMovie = `
    CREATE TABLE IF NOT EXISTS movies(
      movieId INT(6) NOT NULL PRIMARY KEY,
      name VARCHAR(255),
      year VARCHAR(255),
      description VARCHAR(1024),
      genre VARCHAR(255),
      duration VARCHAR(255),
      adminId INT(6)
    )`;
   
         con.query(createMovie, (err, result) => {
           if (err) throw err;
           console.log('Table [movies] created');
         });
  
   let getMovie = `SELECT * FROM movies WHERE movieId = ?`;
   let getAllReviews = `SELECT * FROM reviews WHERE movieId = ?`
   let output ={};
   
    con.query(getMovie, [req.params.id], (err, result) => {
        if (err) {
        res.status(500).json({error: err.code})
        }else {
          output.movie = result[0];
          con.query(getAllReviews, req.params.id, (err, resultReview) => {
            if (err) {
              res.status(500).json({error: err.code})
              }else {
                output.reviews = resultReview;
                res.send(output)
              }
          })
        }
       });
  });

  router.delete('/:id', auth, async(req, res) => {
    const createReview = `
     CREATE TABLE IF NOT EXISTS reviews(
       reviewId INT(6) NOT NULL PRIMARY KEY,
       movieId INT(6),
       userId INT(6),
       userName VARCHAR(255),
       firstName VARCHAR(255),
       lastName VARCHAR(255),
        review VARCHAR(2048)
     )`;
 
       con.query(createJob, (err, result) => {
         if (err) throw err;
         console.log('Table [jobs] created');
       });

   let reviewId = parseInt(req.params.id);
   let deleteReview = `DELETE FROM reviews WHERE movieId = ? && userId = ?`;

 
            con.query(deleteReview, [reviewId, req.user.userId], (err, result) => {
              if (err) {
              res.status(500).json({error: err.code})
              }else {
                res.send('Success')
                 }
             });
 });
  
   module.exports = router;