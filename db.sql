const createAdmin = `
   CREATE TABLE IF NOT EXISTS admin(
     adminId INT(6) NOT NULL PRIMARY KEY,
     firstName VARCHAR(255),
     lastName VARCHAR(255),
     email VARCHAR(255),
     password VARCHAR(1024)
   )`;
/* This command is used to create Admin Table IF it does exists before*/


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
/* This command is used to create Movie If it does exists before*/
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


`SELECT * fROM movies`
/* It shows all the movies */

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
/* This command is used to create Review*/

  const createUser = `
   CREATE TABLE IF NOT EXISTS users(
     userId INT(6) NOT NULL PRIMARY KEY,
     userName VARCHAR(255),
     firstName VARCHAR(255),
     lastName VARCHAR(255),
     email VARCHAR(255),
     password VARCHAR(1024)
   )`;

/* This command is used to create user*/   