var express = require('express');
var app = express();

var mysql = require('mysql');
var util = require('util');
var url = require('url');
var path = require('path');
var bodyParser = require('body-parser');

//CORS
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","*");
  res.header("Access-Control-Allow-Methods","*");
  next();
})

var urlencodedParser = bodyParser.urlencoded({extended: false})
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//Yhteys tietokantaan
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Zorro",
  database: "moviedb"
});

const query = util.promisify(con.query).bind(con);

con.connect(function(err){
  if (err) throw err;
  console.log("Connected to MySQL!");
});

//Elokuvan haku nimen perusteella
app.get("/api/movies/name", function(req,res){
  console.log("Select movies by name");
  var q = url.parse(req.url, true).query;
  var name = q.name;
  var alteredResult;
  var string;
  var sql = 'SELECT * FROM movie WHERE name = ?';


  (async () => { // IIFE (Immediately Invoked Function Expression)
    try {
      const rows = await query(sql,[name]);
      string = JSON.stringify(rows);
      alteredResult = '{"numOfRows":'+rows.length+',"rows":'+string+'}';
      console.log(rows);
      res.send(alteredResult);
    }
    catch (err) {
      console.log("Database error!"+ err);
    }
  })()
})

//HAKU ARVOSTELUN PERUSTEELLA
app.get("/api/movies/rating", function (req, res) {
  console.log("Get movies by rating");
  var q = url.parse(req.url, true).query;
  var fromRating = q.start;
  var toRating = q.end;
  var alteredResult;
  var string;
  console.log("Parametrit:"+ fromRating+ " "+ toRating);

  var sql = "SELECT Movie.name, Movie.genre, Movie.duration, Movie.description," +
      " Movie.release_date, Rating.rating, Rating.comments" +
      " FROM Rating, View, Movie WHERE Rating.view_id = View.view_id and View.movie_id = Movie.movie_id" +
      " and Rating.rating >= ? and Rating.rating <= ?" +
      " GROUP BY Name ORDER BY Rating.rating";

  (async () => { // IIFE (Immediately Invoked Function Expression)
    try {
      const rows = await query(sql,[fromRating, toRating]);
      string = JSON.stringify(rows);
      alteredResult = '{"numOfRows":'+rows.length+',"rows":'+string+'}';
      console.log(rows);
      res.send(alteredResult);
    }
    catch (err) {
      console.log("Database error!"+ err);
    }
    finally {
      //con.end();
    }
  })()
});

//Haetaan kaikki elokuvat
app.get("/api/movies",function(req,res){
  console.log("Get all movies");

  var sql = "SELECT * FROM Movie u LEFT JOIN View d ON u.movie_id = d.movie_id " +
      "LEFT JOIN Rating c ON d.view_id = c.view_id";
  (async () => {
    try {
      const rows = await query(sql);
      console.log(rows);
      res.send(rows);
    } catch (error){
      console.log("Database error" + error);
    }
  })()
});

//Lisätään uusi elokuva
app.post("/api/addMovie",urlencodedParser, function(req,res){
  console.log("body: %j", req.body);
  // get JSON-object from the http-body
  let jsonObj = req.body;
  console.log("Arvo: "+jsonObj.Name);

  //Jos elokuva ei ole katsottu, päivitetään vain Movie-taulu
  if(jsonObj.is_watched === ""){
    var sql = "INSERT INTO Movie (Name, Genre, Duration, Description, Release_date)"
        + "VALUES (?, ?, ?, ?, ?)";
    (async () => {
      try{
        const result1 = await query(sql,[
            jsonObj.Name, jsonObj.Genre, jsonObj.Duration, jsonObj.Description, jsonObj.Release_date]);
        let insertedMovieId = result1.insertId;
        sql = "INSERT INTO View (Place, Date, Movie_id)"
            + "VALUES (?, ?, ?)";
        await query(sql,
            [jsonObj.Place, jsonObj.Date, insertedMovieId]);

        res.send(req.body);
      } catch (error){
        console.log("Insertion into Movie-table was unsuccessful!" + error);
        res.send("POST was not succesful " + error);
      }
    })()
  }
  //Jos elokuva on katsottu päivitetään kaikki taulut
  else {
    sql = "INSERT INTO Movie (Name, Genre, Duration, Description, Release_date, is_watched)"
        + "VALUES (?, ?, ?, ?, ?, ?)";
    (async() =>{
      try {
        const result1 = await query(sql, [
          jsonObj.Name, jsonObj.Genre, jsonObj.Duration, jsonObj.Description, jsonObj.Release_date, jsonObj.is_watched]);

        let insertedMovieId = result1.insertId;
        sql = "INSERT INTO View (Place, Date, Movie_id)"
            + "VALUES (?, ?, ?)";
        const result2 = await query(sql,
            [jsonObj.Place, jsonObj.Date, insertedMovieId]);

        let insertedViewId = result2.insertId;

        sql = "INSERT INTO Rating (Rating, Comments, View_id)"
            + " VALUES ( ?, ?, ?)";
        await query(sql, [jsonObj.Rating, jsonObj.Comments, insertedViewId]);
        res.send(req.body);
      }catch (err) {
        console.log("Insertion into some (2) table was unsuccessful!" + err);
        res.send("POST was not succesful " + err);
      }
    })()
  }
});

//Poistaa elokuvan (ja muut taulut)
app.delete("/api/delete/:movie_id",function(req,res){
  console.log("Delete movie");
  var movie_id = req.params.movie_id;
  var string;
  var sql = "DELETE FROM movie WHERE movie_id = ?";
  (async () => { // IIFE (Immediately Invoked Function Expression)
    try {
      const rows = await query(sql, [movie_id]);
      string = JSON.stringify(rows);
      console.log(string);
      res.send(rows);
    }
    catch (err) {
      console.log("Delete was not succesful!"+ err);
    }
  })()
});

//Päivitetään onko katsottu
//Haku pitää olla mallia localhost:8081/api/update?watched=1&id=1

//KORJAA VIEW JA RATING TAULUN PÄIVITTÄMINEN
app.put("/api/update",function(req,res){
  console.log("Update movie");
  var q = url.parse(req.url, true).query;
  var movieid = q.id;
  var is_watched = q.watched;
  var alteredResult;
  var string;
  console.log("Parametrit:"+ movieid + " "+ is_watched);
    var sql = "UPDATE Movie SET is_watched = ? WHERE movie_id = ?";


  (async () => { // IIFE (Immediately Invoked Function Expression)
    try {
      const rows = await query(sql, [is_watched, movieid]);
      string = JSON.stringify(rows);
      alteredResult = '{"Updated movie with id":' + movieid + ',"rows":' +
          string + '}';
      console.log(rows);
      res.send(rows);
    }
    catch (err) {
      console.log("Update was not succesful!"+ err);
    }
  })()
});

/*
app.get("/events", function(req,res){
  res.sendFile(path.join(__dirname + "/server.html"));
});

app.post("/api/movie",urlencodedParser, function(req,res){
  console.log("body: %j", req.body);
  // get JSON-object from the http-body
  let jsonObj = req.body;
  console.log("Arvo: "+jsonObj.Name);


  //Jos id on suurempi kuin -1,päivitetään vain view ja rating
  if(jsonObj.Movie_id>-1) {
    var sql = "INSERT INTO View (Place, Date, Movie_id)"
        + "VALUES (?, ?, ?)";
    (async () => {
      try {
        const result = await query(sql,
            [jsonObj.Place, jsonObj.Date, jsonObj.Movie_id]);
        let insertedId = result.insertId;
        sql = "INSERT INTO Rating (Rating, Comments, View_id)"
            + " VALUES ( ?, ?, ?)";
        await query(sql, [jsonObj.Rating, jsonObj.Comments, insertedId]);
        res.send("POST succesful " + req.body);
      } catch (err) {
        console.log("Insertion into some (2) table was unsuccessful!" + err);
        res.send("POST was not succesful " + err);
      }

    })()
  }
  //Jos id on -1, päivitetään kaikki taulut
  else {
    sql = "INSERT INTO Movie (Name, Genre, Duration, Description, Release_date, is_watched)"
        + "VALUES (?, ?, ?, ?, ?, ?)";
    (async() =>{
      try {
        const resultLocation = await query(sql, [
          jsonObj.Name, jsonObj.Genre, jsonObj.Duration, jsonObj.Description, jsonObj.Release_date, jsonObj.is_watched]);

        let insertedMovieId = resultLocation.insertId;
        sql = "INSERT INTO View (Place, Date, Movie_id)"
            + "VALUES (?, ?, ?)";
        const resultEvent = await query(sql,
            [jsonObj.Place, jsonObj.Date, insertedMovieId]);

        let insertedViewId = resultEvent.insertId;

        sql = "INSERT INTO Rating (Rating, Comments, View_id)"
            + " VALUES ( ?, ?, ?)";
        await query(sql, [jsonObj.Rating, jsonObj.Comments, insertedViewId]);
        res.send("POST succesful " + req.body);
      }catch (err) {
        console.log("Insertion into some (2) table was unsuccessful!" + err);
        res.send("POST was not succesful " + err);
      }
    })()
  }
});
*/
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
});
