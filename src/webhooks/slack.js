const axios = require('axios')

class SlackWebhook {
    constructor(url) {
        this.url = url
    }

    _getMessage(deployment) {
        let message = `Project: *${deployment.projectName}*\n`;
        message += `Environment: *${deployment.env}*\n`;
        if (deployment.tag) {
            message += `Tag: *${deployment.tag}*\n`;
        }
        if (deployment.branch) {
            message += `Branch: *${deployment.branch}*\n`;
        }
        if (deployment.commitHash) {
            message += `Commit hash: *${deployment.commitHash}*\n`;
        }

        return {
            "text": `Project ${deployment.projectName} deployed`,
            "blocks": [{
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": "New deployment",
                        "emoji": true
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": message
                    }
                }
            ]
        }
    }

    send(deployment) {
        if (this.url) {
            axios
                .post(this.url, this._getMessage(deployment))
                .catch(error => {
                    console.error(error)
                })
        }
    }
}

module.exports = SlackWebhook;