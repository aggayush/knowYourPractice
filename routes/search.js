var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/search', function(req, res, next) {
  res.render('searchpage', { title: 'KnowYourPractice', country: req.query.country, city: req.query.city, locality: req.query.locality, speciality: req.query.speciality});
});
module.exports = router;
