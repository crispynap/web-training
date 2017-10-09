module.exports = function (passport) {
	var route = require('express').Router();
	var conn = require('../config/db')();
	var bkfd2Password = require('pbkdf2-password');
	var hasher = bkfd2Password();

	route.post('/login',
		// passport.authenticate(
		// 	'local', {
		// 		successRedirect: '/topic',
		// 		failureRedirect: '/auth/login',
		// 		failureFlash: false
		// 	}
		// )
		passport.authenticate('local'),
		function (req, res) {
			console.log(req.body)
			res.redirect('/')
		}
	);

	route.post('/register', function (req, res) {
		hasher({
			password: req.body.password
		}, function (err, pass, salt, hash) {
			var user = {
				authId: 'local:' + req.body.userId,
				userId: req.body.userId,
				password: hash,
				salt: salt,
				nickname: req.body.nickname,
				email: req.body.email
			};
			var sql = 'INSERT INTO users SET ?';
			conn.query(sql, user, function (err, results) {
				if (err) {
					console.log(err);
					res.status(500);
				} else {
					req.login(user, function (err) {
						req.session.save(function () {
							res.redirect('/');
						});
					});
				}
			});
		});
	});
	route.get('/register', function (req, res) {
		res.render('auth/register');
	});
	route.get('/login', function (req, res) {
		res.render('auth/login');
	});

	route.get('/logout', function (req, res) {
		req.logout();
		req.session.save(function () {
			res.redirect('/');
		});
	});

	route.post('/register/idcheck', function (req, res) {
		var sql = 'SELECT userId FROM users WHERE userId = ?';
		conn.query(sql, req.body.data, function (err, results) {
			if (err) {
				console.log(err);
				res.status(500);
			} else {
				if (results[0]) {
					res.send('found');
				} else {
					res.send('not found');
				}
			}
		})
	});

	route.post('/register/nickcheck', function (req, res) {
		var sql = 'SELECT nickname FROM users WHERE nickname = ?';
		conn.query(sql, req.body.data, function (err, results) {
			if (err) {
				console.log(err);
				res.status(500);
			} else {
				if (results[0]) {
					res.send('found');
				} else {
					res.send('not found')
				}
			}
		})
	});

	return route;
};
