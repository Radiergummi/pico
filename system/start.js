/**
 * boot the system
 */
require(SYS + 'boot.js')

/**
 * boot the app
 */
require(APP + 'start.js')

/**
 * bring up the http server
 */
var server = require(SYS + 'server.js')

/**
 * load debug events
 */
if (Config.get('app.env', false) === 'development') require(SYS + 'debug.js')

/**
 * start the server
 */
server.start(function(req, res) {
try {
    /**
     * trigger the request event
     */
    eventDispatcher.trigger('server:request', req)

    /**
     * detect the input
     */
    var input = Input.detect(req),
    		session = new Session()

    /**
     * check the cache for this page
     */
    if (Cache.has(input.raw)) {
        
        /**
         * retrieve the response from the cache by URI
         */
        var response = Cache.get(input.raw)
        
        /**
         * set the cached header (debug)
         */
        response.setHeader('X-Served-From-Cache', 'true')
    }
    
    else {
        /**
         * route a response
         */
        var response = Router.create(input).dispatch()

        /**
         * cache the response
         */
        Cache.set(input.raw, response)
    }

    /**
     * dispatch the response event
     */
    eventDispatcher.trigger('server:response', response)

    /**
     * send the response to the client
     */
    return response.send(res)
    }
    
    catch (error) {
        console.error('An error occured which prevented the request from being served. Error: ' + error.stack)
    }
})
