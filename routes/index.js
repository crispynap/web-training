module.exports = function (passport) {
	var route = require('express').Router();

	route.get('/', function (req, res) {
		res.render('index');
	});

	return route;
};