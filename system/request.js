var Request = {
    method: function () {
        return Config.get('request.method')
    },
    
    protocol: function () {
        // TODO: verify
        return Config.get('request.protocol')
    },
    
    ajax: function () {
        return (Config.get('request.headers.HTTP_X_REQUESTED_WITH.XMLHttpRequest' === 0))
    }
}

module.exports = Request
