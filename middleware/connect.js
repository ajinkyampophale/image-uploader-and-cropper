const mysql = require('mysql');

const con = mysql.createConnection({
    "host": "127.0.0.1",
    "port": "3306",
    "user": "username",
    "password": "password",
    "database": "db_imgupload"
});


con.connect((err) => {
    if (err) throw err;
    console.log("Mysql connected...");
});

module.exports = con;