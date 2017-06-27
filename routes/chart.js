var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/chart', function(req, res, next) {
  res.render('chart');
});



module.exports = router;
