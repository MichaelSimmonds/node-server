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
var chart = require('./routes/chart');
//initialise express
var app = express();
//initialise websockets
var server = require('http').Server(app);
var socketIn = require('socket.io-client')('http://localhost:8080');
var io = require('socket.io')(server);
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
app.use('/chart', chart);

// WEbsockets io
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});


//websocket data incoming
socketIn.on('connection', function(){ console.log("hookdata WS connected")});
var prev_timepoint = new Date("2011-03-26T18:15:04.982Z")
socketIn.on('data', function(data){
  //the collection is dependant on the timestamp.
  //evert timepoint is stored in hookdata collection
  //IF the timpoint.minute changes from the previous timepoint - add the first timepoint into the hookdata-minute collection(this should be an average of the timepoints but outside the scope of POC)
  var curr_timepoint = new Date(data.timestamp);
  var data = data

  if (curr_timepoint.getMinutes() != prev_timepoint.getMinutes()) {
    insertDB(data, 'hookdata-minute', "minute   ");
  }
  //IF the timepoint hour changes add to hookdata-hour
  if (curr_timepoint.getHours() != prev_timepoint.getHours()) {
    insertDB(data, 'hookdata-hours', "Hour")
  }
  //This would continue to day, week, month and year but outside scope of POC.
  //Also add the data to the overall hookdata table
  insertDB(data, 'hookdata', "timepoint");
  prev_timepoint = curr_timepoint
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
//
// socket.on('connection', function (socket) {
//   socket.emit('dataFE', { hello: 'world' });
// });


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
