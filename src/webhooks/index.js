const SlackWebhook = require('./slack')

module.exports = [
    new SlackWebhook(process.env.SLACK_URL)
];