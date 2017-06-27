var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  getData(req, function(err, data) {
    //This is recieving ALL THE DATA from the table and slicing only the last 10 values - the getData function should only query for  last values. Issues with converting cursors to arrays in mongodb.
    var hkldArray = data.slice(-10,-1).map(function(datapoint){
      return datapoint.hkld
    })
    console.log(hkldArray)

    res.render('index', {
        title: "Index",
        hkldArray: hkldArray
    });
  })
});


function getData(req, callback){
  var db = req.db;
  var collection = db.get('hookdata');
  // var last10 = collection.find().sort({_id:1}).limit(50)
  collection.find({}).then(function (value) { callback(null,value) });
}

module.exports = router;
