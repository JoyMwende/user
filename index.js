const mysql = require("mysql");
const express = require("express");
var app = express();
const bodyparser = require("body-parser");

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "user",
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
  if (!err) console.log(" DB Connection Successful!");
  else
    console.log(
      "DB connection failed \n Error : " + JSON.stringify(err, undefined, 2)
    );
});


//Get users
app.get("/user", (req, res) => {
  mysqlConnection.query("SELECT * FROM users", (err, rows, fields) => {
    if (!err) {
      console.log(rows);
      res.json(rows)
    } else {
      console.log(err);
     
    }
  });
});

//Get an user
app.get("/user/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM users WHERE id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

//Delete an user
app.delete("/user/:id", (req, res) => {
  mysqlConnection.query(
    "DELETE FROM users WHERE id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send("Deleted successfully.");
      else console.log(err);
    }
  );
});

//Insert an user
app.post('/user', (req, res) => {
    let users = req.body;
    var sql = "SET @id = ?;SET @firstName = ?;SET @secondName = ?;SET @email = ?;SET @project = ?;SET @password = ?; \
    CALL usersAddOrEdit(@id,@firstName,@secondName,@email,@project,@password);";
    mysqlConnection.query(sql, [users.id, users.firstName, users.secondName, users.email, users.project, users,password], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted users id : '+element[0].id);
            });
        else
            console.log(err);
    })
});

//Update an user
app.put('/user', (req, res) => {
    let users = req.body;
    var sql = "SET @id =?;SET @firstName = ?;SET @secondName = ?;SET @email = ?;SET @project = ?;SET @password = ?; \
    CALL usersAddOrEdit(@id,@firstName,@secondName,@email,@project,@password);";
    mysqlConnection.query(sql, [users.id, users.firstName, users.secondName, users.email, users.project, users,password], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});

const port= 8000;
app.listen(port, () =>
  console.log("Express server is runnig at port no : 8080")
);