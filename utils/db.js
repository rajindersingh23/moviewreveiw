const mysql = require('mysql');

var db  = mysql.createPool({
    connectionLimit: 10,
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'bd4c4714fee55e',
    password: 'b33e67a1',
    database: 'heroku_805ab6620f06cbe'
});

/*
db.connect(err => {
    if (err) throw err;
    console.log("Connected!");
});
  */
module.exports = db;