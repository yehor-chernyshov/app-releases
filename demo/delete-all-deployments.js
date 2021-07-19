require('dotenv').config();
const mongoose = require('mongoose');
const Deployment = require('../src/models/Deployment');

mongoose.connect(process.env.MONGO_DB_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', err => {
    console.error('connection error', err)
})

Deployment.deleteMany({})
    .then(() => console.log("All deployment deleted"))
    .catch(error => console.log(error));