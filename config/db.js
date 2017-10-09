module.exports = function () {
	var mysql = require('mysql');
	var conn = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'Bingo0221!',
		database: 'lets'
	});
	conn.connect();
	return conn;
}