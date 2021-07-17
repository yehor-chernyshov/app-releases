const mongoose = require('mongoose')
const Schema = mongoose.Schema

const deploymentSchema = new Schema({
    projectName: { type: String, required: true },
    commitHash: {
        type: String,
        default: null,
        validate() {
            return this.commitHash || this.branch || this.tag
        }
    },
    tag: {
        type: String,
        default: null,
        validate() {
            return this.commitHash || this.branch || this.tag
        }
    },
    branch: {
        type: String,
        default: null,
        validate() {
            return this.commitHash || this.branch || this.tag
        }
    },
    env: { type: String, required: true },
    date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Deployment', deploymentSchema)