class Auth {
    constructor(writeTokens, readTokens) {
        this.writeTokens = writeTokens
        this.readTokens = readTokens
    }

    _isValidToken(token, tokens) {
        return token == null || tokens.includes(token)
    }

    apiWriteTokenAuthenticate() {
        const self = this;
        return function(req, res, next) {
            if (!self._isValidToken(req.headers['authorization'], self.writeTokens)) {
                return res.sendStatus(401)
            }
            next()
        }
    }

    apiReadTokenAuthenticate() {
        const self = this;
        return function(req, res, next) {
            if (!self._isValidToken(req.query.authorization, self.readTokens)) {
                return res.sendStatus(401)
            }
            next()
        }
    }
}

module.exports = Auth;