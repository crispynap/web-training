module.exports = function () {
	var express = require('express');
	var session = require('express-session');
	var MySQLStore = require('express-mysql-session')(session);
	var bodyParser = require('body-parser');

	var app = express();
	app.use(express.static('public'));
	app.set('views', './views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;
	app.use(bodyParser.urlencoded({ extended: false }));
	app.set('trust proxy', 1) // trust first proxy
	app.use(session({
		secret: 'sdgfeth@2#%$@fg',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
		store: new MySQLStore({
			host: 'localhost',
			port: 3306,
			user: 'root',
			password: 'Bingo0221!',
			database: 'lets'
		}),
	}));
	return app;
}