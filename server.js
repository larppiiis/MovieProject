/**
 *
 * Popcorn Time-sovelluksen palvelin
 * 24.4.2022
 * @author Laura Immonen
 *
 */

var express = require('express');
var app = express();

var mysql = require('mysql');
var util = require('util');
var url = require('url');
var bodyParser = require('body-parser');

/**
 * Cors asetukset, kaikki sallitaan
 */
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

/**
 *
 * Asetukset client-puolelle asettamiselle
 * ja json käsittelyä varten
 */
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/**
 *
 * Yhteys tietokantaan
 */
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Zorro',
  database: 'moviedb',
});

const query = util.promisify(con.query).bind(con);

con.connect(function(err) {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

/**
 * Elokuvan haku nimen perusteella
 * (Käyttämätön)
 */
app.get('/api/movies/name', function(req, res) {
  console.log('Select movies by name');
  var q = url.parse(req.url, true).query;
  var name = q.name;
  var alteredResult;
  var string;
  var sql = 'SELECT * FROM movie WHERE name = ?';

  (async () => { // IIFE (Immediately Invoked Function Expression)
    try {
      const rows = await query(sql, [name]);
      string = JSON.stringify(rows);
      alteredResult = '{"numOfRows":' + rows.length + ',"rows":' + string + '}';
      console.log(rows);
      res.send(alteredResult);
    } catch (err) {
      console.log('Database error!' + err);
    }
  })();
});

/**
 *
 * Elokuvan haku arvostelun perusteella
 * (Käyttämätön)
 */
app.get('/api/movies/rating', function(req, res) {
  console.log('Get movies by rating');
  var q = url.parse(req.url, true).query;
  var fromRating = q.start;
  var toRating = q.end;
  var alteredResult;
  var string;
  console.log('Parametrit:' + fromRating + ' ' + toRating);

  var sql = 'SELECT Movie.name, Movie.genre, Movie.duration, Movie.description,' +
      ' Movie.release_date, Rating.rating, Rating.comments' +
      ' FROM Rating, View, Movie WHERE Rating.view_id = View.view_id and View.movie_id = Movie.movie_id' +
      ' and Rating.rating >= ? and Rating.rating <= ?' +
      ' GROUP BY Name ORDER BY Rating.rating';

  (async () => { // IIFE (Immediately Invoked Function Expression)
    try {
      const rows = await query(sql, [fromRating, toRating]);
      string = JSON.stringify(rows);
      alteredResult = '{"numOfRows":' + rows.length + ',"rows":' + string + '}';
      console.log(rows);
      res.send(alteredResult);
    } catch (err) {
      console.log('Database error!' + err);
    } finally {
      //con.end();
    }
  })();
});

/**
 * Kaikkien elokuvien haku
 */
app.get('/api/movies', function(req, res) {
  console.log('Get all movies');

  var sql = 'SELECT * FROM Movie u LEFT JOIN View d ON u.movie_id = d.movie_id ' +
      'LEFT JOIN Rating c ON d.view_id = c.view_id';
  (async () => {
    try {
      const rows = await query(sql);
      console.log(rows);
      res.send(rows);
    } catch (error) {
      console.log('Database error' + error);
    }
  })();
});

/**
 * Uuden elokuvan lisääminen
 */
app.post('/api/addMovie', urlencodedParser, function(req, res) {
  console.log('body: %j', req.body);
  // get JSON-object from the http-body
  let jsonObj = req.body;
  console.log('Arvo: ' + jsonObj.Name);

  //Jos elokuva ei ole katsottu, päivitetään vain Movie-taulu
  if (jsonObj.is_watched === '') {
    var sql = 'INSERT INTO Movie (Name, Genre, Duration, Description, Release_date)'
        + 'VALUES (?, ?, ?, ?, ?)';
    (async () => {
      try {
        const result1 = await query(sql, [
          jsonObj.Name,
          jsonObj.Genre,
          jsonObj.Duration,
          jsonObj.Description,
          jsonObj.Release_date]);
        let insertedMovieId = result1.insertId;
        sql = 'INSERT INTO View (Place, Date, Movie_id)'
            + 'VALUES (?, ?, ?)';
        await query(sql,
            [jsonObj.Place, jsonObj.Date, insertedMovieId]);

        res.send(req.body);
      } catch (error) {
        console.log('Insertion into Movie-table was unsuccessful!' + error);
        res.send('POST was not succesful ' + error);
      }
    })();
  }
  //Jos elokuva on katsottu päivitetään kaikki taulut
  else {
    sql = 'INSERT INTO Movie (Name, Genre, Duration, Description, Release_date, is_watched)'
        + 'VALUES (?, ?, ?, ?, ?, ?)';
    (async () => {
      try {
        const result1 = await query(sql, [
          jsonObj.Name,
          jsonObj.Genre,
          jsonObj.Duration,
          jsonObj.Description,
          jsonObj.Release_date,
          jsonObj.is_watched]);

        let insertedMovieId = result1.insertId;
        sql = 'INSERT INTO View (Place, Date, Movie_id)'
            + 'VALUES (?, ?, ?)';
        const result2 = await query(sql,
            [jsonObj.Place, jsonObj.Date, insertedMovieId]);

        let insertedViewId = result2.insertId;

        sql = 'INSERT INTO Rating (Rating, Comments, View_id)'
            + ' VALUES ( ?, ?, ?)';
        await query(sql, [jsonObj.Rating, jsonObj.Comments, insertedViewId]);
        res.send(req.body);
      } catch (err) {
        console.log('Insertion into some (2) table was unsuccessful!' + err);
        res.send('POST was not succesful ' + err);
      }
    })();
  }
});

/**
 * Kun elokuva katsottu (watched-nappia painettu), päivitetään view ja rating taulut
 */
app.put('/api/movies/watched/:movie_id', urlencodedParser, function(req, res) {
  console.log('body: %j', req.body);
  var movieid = req.params.movie_id;
  // get JSON-object from the http-body
  let jsonObj = req.body;
  var makeWatched = 'UPDATE Movie SET is_watched = 1 WHERE movie_id = ?';

  (async () => { // IIFE (Immediately Invoked Function Expression)
    try {
      await query(makeWatched, movieid);

      sql = 'UPDATE View SET Place = ?, Date = ? WHERE Movie_id = ?';
      await query(sql, [jsonObj.Place, jsonObj.Date, movieid]);
      const viewidquery = await query(
          'SELECT View_id FROM View WHERE Movie_id = ?', movieid);
      console.log(viewidquery);
      let viewid = viewidquery[0].View_id;

      sql = 'INSERT INTO Rating (Rating, Comments, View_id)'
          + ' VALUES ( ?, ?, ?)';
      await query(sql, [jsonObj.Rating, jsonObj.Comments, viewid]);
      res.send(req.body);
      console.log('Updated!');
    } catch (err) {
      console.log('Update was not succesful!' + err);
    }
  })();
});

/**
 * Kun unwatched-nappia painetaan, poistetaan view ja rating tauluista tiedot
 */
//Haku pitää olla mallia localhost:8081/api/movies/unwatched?id=1
app.put('/api/movies/unwatched', function(req, res) {
  console.log('Update movie');
  var q = url.parse(req.url, true).query;
  var movieid = q.id;
  var alteredResult;
  var string;
  console.log('Parametrit:' + movieid);
  var unwatched = 'UPDATE View SET Place = NULL, Date = NULL where Movie_id = ?';
  var deleteRating = 'DELETE FROM Rating WHERE view_id = ?';

  var sql = 'UPDATE Movie SET is_watched = 0 WHERE movie_id = ?';

  (async () => { // IIFE (Immediately Invoked Function Expression)
    try {
      const viewidquery = await query(
          'SELECT View_id FROM View WHERE Movie_id = ?', movieid);
      let viewid = viewidquery[0].View_id;
      const rows = await query(sql, movieid);
      const bla = await query(unwatched, movieid);
      await query(deleteRating, viewid);
      string = JSON.stringify(rows);
      alteredResult = '{"Updated movie with id":' + movieid + ',"rows":' +
          string + '}';
      console.log(alteredResult);
      res.send(bla);
    } catch (err) {
      console.log('Update was not succesful!' + err);
    }
  })();
});


/**
 * Poistetaan elokuva ja siihen liittyvät taulut
 */
app.delete('/api/delete/:movie_id', function(req, res) {
  console.log('Delete movie');
  var movie_id = req.params.movie_id;
  var string;
  var sql = 'DELETE FROM movie WHERE movie_id = ?';
  (async () => { // IIFE (Immediately Invoked Function Expression)
    try {
      const rows = await query(sql, [movie_id]);
      string = JSON.stringify(rows);
      console.log(string);
      res.send(rows);
    } catch (err) {
      console.log('Delete was not succesful!' + err);
    }
  })();
});

/**
 * Portin määrittelyä
 */
var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
