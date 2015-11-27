var http = require('http')

module.exports = {
    start: function(callback) {

        // create a server
        this.instance = http.createServer(callback)
        

        // lets start our server
        this.instance.listen(Config.get('app.server.port'), function() {
            eventDispatcher.trigger('server:listening', {
                url: Config.get('app.url'),
                port: Config.get('app.server.port')
            })
        })
    }
}
