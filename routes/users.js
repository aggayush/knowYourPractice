var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false}));
router.use(bodyParser.json());

/* GET users listing. */
router.post('/:practiceName', function(req, res, next) {

  res.render('practice',{ title: 'knowYourPractice', name: req.body.practiceName, id: req.body.practiceID });
});

module.exports = router;
