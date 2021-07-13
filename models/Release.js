const mongoose = require('mongoose')
const Schema = mongoose.Schema

const releaseSchema = new Schema({
    projectName: { type: String, required: true },
    commitHash: { type: String, default: null },
    tag: { type: String, default: null },
    branch: { type: String, default: null },
    date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Release', releaseSchema)