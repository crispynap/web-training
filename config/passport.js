module.exports = function(app){
	var conn = require('./db')();
	var bkfd2Password = require('pbkdf2-password');
	var passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy;
	var hasher = bkfd2Password();
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser(function(user, done) {
		done(null, user.authId);
	});

	passport.deserializeUser(function(id, done) {
		var sql = 'SELECT * FROM users WHERE authId=?';
		conn.query(sql, [id], function(err, results){
			if(err){
				console.log(err);
				done('There is no user.');
			}
			else{
				done(null, results[0]);
			}
		})
	});

	passport.use(new LocalStrategy(
	function(username, password, done) {
		var uname = username;
		var pwd = password;
		var sql = 'SELECT * FROM users WHERE authId=?';
		conn.query(sql, ['local:'+uname],function(err, results){
			if(err){
				return done('There is no user.');
			}
			var user = results[0];
			return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
				if(hash === user.password){
					return done(null, user);
				} else {
					return done(null, false, {message : '비번 틀림'});
				}
			return done(null, false, {message : '아이디 없음'});	
			});
		})
		}
	));
	return passport;
}

