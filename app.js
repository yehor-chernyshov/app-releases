var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const SlackWebhook = require('./webhooks/slack')

mongoose.connect(process.env.MONGO_DB_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.once('open', _ => {
    console.log('Database connected')
})
db.on('error', err => {
    console.error('connection error', err)
})

var indexRouter = require('./routes/index');
var deploymentsRouter = require('./routes/deployments');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const webhooks = [
    new SlackWebhook(process.env.SLACK_URL)
];

app.use('/', indexRouter);
app.use('/api/deployments', deploymentsRouter(process.env.API_TOKEN, webhooks));

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