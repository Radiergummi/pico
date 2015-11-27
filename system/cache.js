var Helper = require(SYS + 'helper.js')

var Cache = function (options) {
    Cache.options = Helper.extend(Cache.options, options)
    
    if (Cache.cleanupInterval === null) {
        Cache.startAutomaticCleanup()
    }
}

Cache.options = {
    ttl: 10000
}

Cache.storage = {}
Cache.ttl = {}
Cache.cleanupInterval = null

Cache.events = {
    set: function(){},
    del: function(){},
    flush: function(){},
    cleanup: function(){}
}

Cache.startAutomaticCleanup = function () {
    Cache.cleanupInterval = setInterval(function() {
        return Cache.cleanup()
    }, Cache.options.ttl)
}

Cache.stopAutomaticCleanup = function () {
    clearInterval(Cache.cleanupInterval)
}

Cache.cleanup = function () {

    // iterate over keys
    for (var key in Cache.ttl) {

        // check for stale cache entries and delete them
        if (Cache.ttl[key] <= Date.now()) {
            delete Cache.storage[key]
        }
    }

    // call the cleanup event
    Cache.events.cleanup()
}
                                                    
Cache.prototype = {
    events: null,
    constructor: Cache,

    /**
     * get function.
     * retrieves a key
     * 
     * @param {string} key  the key to get
     * @return {mixed}
     */
    get: function (key) {
        if (Cache.storage.hasOwnProperty(key)) return Cache.storage[key]
        
        // if we don't have that key yet, return undefined
        return undefined
    },
    
    has: function (key) {
        return (Cache.storage.hasOwnProperty(key))
    },

    /**
     * set function.
     * stores a key.
     *
     * @param {string} key   the key to set
     * @param {mixed} value  the value to set
     * @return void
     */
    set: function (key, value) {
        try {
            Cache.storage[key] = value
            Cache.ttl[key] = (Date.now() + Cache.options.ttl)
        }
        
        catch (error) {
            console.error('Could not set cache item ' + key + '. Error: ' + error)
        }
        
        // call the set event
        Cache.events.set(key, value)
        
        return this
    },

    /**
     * del function.
     * deletes a key.
     *
     * @param {string} key  the key to delete
     * @return void
     */
    del: function (key) {
        // retrieve the value
        var value = Cache.storage[key]
        
        // delete the key
        delete Cache.storage[key]

        // call the del event
        Cache.events.del(key, value)
        
        return this
     },

    /**
     * flush function.
     * flushes all data.
     *
     * @return void
     */
    flush: function () {
        // purge the storage
        Cache.storage = {}
        
        // call the flush event
        Cache.events.flush()
        
        return this
    },

    /**
     * keys function.
     * returns an array of all keys
     * 
     * @param {function} callback  a callback to execute
     * @return {Array}             the caches keys
     */
    keys: function (callback, data) {
        var keys = []
        for (var key in Cache.storage) keys.push(key)
        
        // if we have a callback given, return it with an optional data object
        if (typeof callback !== 'undefined') {
            if (typeof data === 'undefined') data = {}

            return callback(keys, data)
        }
        
        // return keys only
        return keys
    },
    
    /**
     * on function.
     * registers an event handler
     *
     * @param {string} event       the event to register a handler for
     * @param {function} callback  the handler to register 
     */
    on: function (event, callback) {
        try {
            // push the callback to the event object
            Cache.events[event] = callback
        }
        
        // if we get an error, the event does not exist. To ease things, we 
        // print an error to the console and show a list of possible events.
        catch (error) {
            var events = []
            for (var event in Cache.events) events.push(event)
            console.error('Event ' + event + ' does not exist. Available events: ' + events.join(', ') + '.')
        }
        
        return this
    },
    
    setOption: function (key, value) {
        Cache.options[key] = value
        
        return this
    }
}

module.exports = new Cache()
