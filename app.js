var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//library
var flash   = require('express-flash');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts'); // <-- route posts
var typesRouter = require('./routes/question_type'); // <-- route posts
var questionsRouter = require('./routes/question'); // <-- route posts
var quizRouter = require('./routes/question_test'); // <-- route posts
var quizGroupRouter = require('./routes/quizGroup'); // <-- route posts
var quizSoalRouter = require('./routes/quizSoal'); // <-- route posts
var quizHistoryRouter = require('./routes/question_history'); // <-- route posts

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('partials', path.join(__dirname, 'views/components'));
app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'views/components'),
  path.join(__dirname, 'views/partials')
]);

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
  cookie: { 
    maxAge: 60000 
  },
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}))

app.use(flash())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter); // use route posts di Express
app.use('/question_type', typesRouter); // use route posts di Express
app.use('/question', questionsRouter); // use route posts di Express
app.use('/quiz', quizRouter); // use route posts di Express
app.use('/quiz_group', quizGroupRouter); // use route posts di Express
app.use('/quiz_soal', quizSoalRouter); // use route posts di Express
app.use('/quiz_history', quizHistoryRouter); // use route posts di Express

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;