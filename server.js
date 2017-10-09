var app = require('./config/express')();
var passport = require('./config/passport')(app);
var conn = require('./config/db')();

var auth = require('./routes/auth')(passport);
app.use('/auth', auth);

var index = require('./routes/index')(passport);
app.use('/', index);

app.listen(3000, function () {
	console.log('Connected 3000 port!');
});