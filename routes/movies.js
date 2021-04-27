const express = require("express");
const router = express.Router();
var con = require('../utils/db');
const auth = require('../utils/authAdmin');
const Joi = require("joi");

router.post('/', auth, async(req, res) => {
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

       let id = Math.floor(100000 + Math.random() * 900000);
       let name = req.body.name;
       let year = req.body.year;
       let description = req.body.description;
       let genre = req.body.genre;
       let duration = req.body.duration;
       let adminId = req.admin.adminId;
       let insertMovie = `INSERT INTO movies (movieId, name, year, description, genre, duration, adminId) VALUES (?,?,?,?,?,?,?)`;

 const { error } = validateMovie(req.body);
if (error) return res.send({error: error.details[0].message})
else{
  con.query(insertMovie,[id, name, year, description, genre, duration, adminId], (err, result) => {
    if (err) {
    res.status(500).json({error: err.code})
    }else {
      console.log(result)
      res.json({
           id,
           name,  
           year,
           description,
           genre,
           duration,
           adminId
           })
       }
   });
}
});

 router.get('/', async(req, res) => {
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

   let getAllMovies = `SELECT * fROM movies`;

   
    con.query(getAllMovies, (err, result) => {
        if (err) {
        res.status(500).json({error: err.code})
        }else {
          console.log(result)
          res.send(result)
           }
       });
 });

 router.get('/admin', auth, async(req, res) => {
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

 let getAllMovies = `SELECT * fROM movies WHERE adminId = ?`;

 
  con.query(getAllMovies, req.admin.adminId, (err, result) => {
      if (err) {
      res.status(500).json({error: err.code})
      }else {
        res.send(result)
         }
     });
});

router.get('/admin/:id', auth, async(req, res) => {
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

 let getAllMovies = `SELECT * FROM movies WHERE movieId = ? AND adminId = ?`;
 let getAllReviews = `SELECT * FROM reviews WHERE movieId = ?`
 let output ={};
 
  con.query(getAllMovies, [req.params.id, req.admin.adminId], (err, result) => {
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

router.delete('/admin/:id', auth, async(req, res) => {
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

 let deleteMovie = `DELETE FROM movies WHERE movieId = ? AND adminId = ?`;
 let deleteReview = `DELETE FROM reviews WHERE movieId = ?`;
 let getAllMovies = `SELECT * fROM movies WHERE adminId = ?`;
 
  con.query(deleteMovie, [req.params.id, req.admin.adminId], (err, result) => {
      if (err) {
      res.status(500).json({error: err.code})
      }else {
        con.query(deleteReview, req.params.id, (err, resultApps) => {
          if (err) {
            res.status(500).json({error: err.code})
            }else {
              con.query(getAllMovies, req.admin.adminId, (err, result) => {
                if (err) {
                res.status(500).json({error: err.code})
                }else {
                  res.send(result)
                   }
               });
            }
        })
      }
     });
});

 function validateMovie(obj) {
  const schema = Joi.object({
      name: Joi.string().min(1).max(100).required(),
      year: Joi.string().min(1).max(4).required(),
      description: Joi.string().min(1).max(1024).required(),
      genre: Joi.string().min(1).max(20).required(),
      duration:Joi.string().min(1).max(100).required(),
  });

  return schema.validate(obj);
}

 module.exports = router;