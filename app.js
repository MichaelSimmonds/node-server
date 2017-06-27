var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//add mongodb
var mongo = require("mongodb");
var monk = require('monk');
var db = monk('localhost:27017/nodetest1')
// routes
var index = require('./routes/index');
//initialise express
var app = express();
//initialise websockets
var server = require('http').Server(app);
var socketIn = require('socket.io-client')('http://localhost:8080');
var io = require('socket.io')(server);
// var io = require('socket.io')('http://localhost:7070');
// var socketIn = io.connect("http://localhost:8080")

server.listen(7070);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router - It adds .db to every request
app.use(function(req,res,next){
    req.db = db;
    next();
});
app.use('/', index);

// Websockets server io
io.on('connection', function (socket) {
  console.log('Socket.io EMITTING')
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});


//websocket data incoming
socketIn.on('connection', function(){ console.log("hookdata WS connected")});


socketIn.on('data', function(data){
  //Place incoming data into Mongodb Database
  insertDB(data, 'hookdata', "timepoint");
});

//Submit to the DB - the 'data' is already a js obj so can go straight into mongodb
function insertDB(data, collection, message){
  collection = db.get(collection)
  collection.insert(data, function (err, doc){
    if (err) {
      //If there is an error - return it
      console.log('There was an error');
    }
    else {
      //log sucessful insertion into db
      // console.log(message + "=>" + data.timestamp);
    }
  });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
