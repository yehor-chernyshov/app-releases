const axios = require('axios')

class SlackWebhook {
    constructor(url) {
        this.url = url
    }

    _getMessage(deployment) {
        const sectionFileds = [{
                "type": "plain_text",
                "text": "Project:",
                "emoji": true
            },
            {
                "type": "plain_text",
                "text": deployment.projectName,
                "emoji": true
            },
            {
                "type": "plain_text",
                "text": "Environment:",
                "emoji": true
            },
            {
                "type": "plain_text",
                "text": deployment.env,
                "emoji": true
            }
        ];

        if (deployment.tag) {
            sectionFileds.push({
                "type": "plain_text",
                "text": "Tag:",
                "emoji": true
            })
            sectionFileds.push({
                "type": "plain_text",
                "text": deployment.tag,
                "emoji": true
            })
        }
        if (deployment.branch) {
            sectionFileds.push({
                "type": "plain_text",
                "text": "Branch:",
                "emoji": true
            })
            sectionFileds.push({
                "type": "plain_text",
                "text": deployment.branch,
                "emoji": true
            })
        }
        if (deployment.commitHash) {
            sectionFileds.push({
                "type": "plain_text",
                "text": "Commit hash:",
                "emoji": true
            })
            sectionFileds.push({
                "type": "plain_text",
                "text": deployment.commitHash,
                "emoji": true
            })
        }
        const payload = {
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
                    "fields": sectionFileds
                }
            ]
        }

        return payload
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