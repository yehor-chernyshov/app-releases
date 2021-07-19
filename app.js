require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const webhooks = require('./src/webhooks/index')
const auth = require('./src/auth')
const helmet = require('helmet')

mongoose.connect(process.env.MONGO_DB_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', err => {
    console.error('connection error', err)
})

const indexRouter = require('./routes/index');
const deploymentsRouter = require('./routes/deployments');

const app = express();
app.use(helmet());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('combined', {
    skip: function(req, res) { return res.statusCode < 400 }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/deployments', deploymentsRouter(auth, webhooks));

if (process.env.SHOW_API_DOCS == 1) {
    const swaggerUi = require('swagger-ui-express');
    const YAML = require('yamljs');
    var pjson = require('./package.json');
    const swaggerDocument = YAML.load('./swagger.yaml')
    swaggerDocument.info.version = pjson.version
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

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