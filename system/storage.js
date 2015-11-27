var Helper = require(SYS + 'helper.js')

/**
 * Storage Constructor
 * Creates a new storage
 */
var Storage = function (options) {
    this.options = Helper.extend(options, {  
      // the default TTL is 0 to avoid unneccessary deletion of static content
      ttl: 0
    })
    
    // if we have a TTL value set and no interval ready yet, start the automatic cleanup
    if (this.options.ttl > 0 && this.cleanupInterval === null) {
        this.startAutomaticCleanup()
    }
}

Storage.prototype = {
    events: null,
    constructor: Storage,
}

// the main data storage
Storage.prototype.data = {}

// the TTL object, holding the creation time stamp for all keys
Storage.prototype.ttl = {}

// the interval for the cleanup function
Storage.prototype.cleanupInterval = null

// the storage events
Storage.prototype.events = {
    
    // gets triggered on new keys stored
    set: function(){},
    
    // gets triggered on keys being deleted
    del: function(){},
    
    // gets triggered on the storage being flushed
    flush: function(){},
    
    // gets triggered on storage cleanup
    cleanup: function(){}
}

Storage.prototype.startAutomaticCleanup = function () {
    this.cleanupInterval = setInterval(function() {
        return this.cleanup()
    }, this.options.ttl)
}

Storage.prototype.stopAutomaticCleanup = function () {
    clearInterval(this.cleanupInterval)
}

Storage.prototype.cleanup = function () {

    // iterate over keys
    for (var key in this.ttl) {

        // check for stale Storage entries and delete them
        if (this.ttl[key] <= Date.now()) {
            delete this.data[key]
        }
    }

    // call the cleanup event
    this.events.cleanup()
}


/**
 * get function.
 * retrieves a key
 * 
 * @param {string} key  the key to get
 * @return {mixed}
 */
Storage.prototype.get =  function (keys, fallback) {
    var object = this.data

    // iterate over given keys
    for (var i = 0, keys = keys.split('.'); i < keys.length; i++) {
      
        // if the object is no object, return the fallback
        if (! object || typeof object !== 'object') return fallback

        // set the object to the current key
        object = object[keys[i]]
    }

    // if no value can be found, return fallback
    if (object === undefined) return fallback

    // return the object in question
    return object
} 


/**
 * has function.
 * checks whether a key exists
 *
 * @param {string} key  the key to check for
 * @return {bool}       whether the key exists or not
 */  
Storage.prototype.has = function (key) {
    return (this.data.hasOwnProperty(key))
}


/**
 * set function.
 * stores a key and saves the TTL for this key
 *
 * @param {string} key   the key to set
 * @param {mixed} value  the value to set
 * @return {this}        for chaining
 */
Storage.prototype.set = function (key, value) {
    try {
        this.data[key] = value
        this.ttl[key] = (Date.now() + this.options.ttl)
    }
    
    catch (error) {
        console.error('Could not set Storage item ' + key + '. Error: ' + error)
    }

    // call the set event
    this.events.set(key, value)
    
    // return this for chaining
    return this
}


/**
 * del function.
 * deletes a key.
 *
 * @param {string} key  the key to delete
 * @return {this}       for chaining
 */
Storage.prototype.del = function (key) {
    // retrieve the value
    var value = this.data[key]
    
    // delete the key
    delete this.data[key]

    // call the del event
    this.events.del(key, value)
    
    // return this for chaining
    return this
}


/**
 * flush function.
 * flushes all data.
 *
 * @return {this}  for chaining
 */
Storage.prototype.flush = function () {
    // purge the storage
    this.data = {}
    
    // call the flush event
    this.events.flush()
    
    // return this for chaining
    return this
}


/**
 * keys function.
 * returns an array of all keys in the storage.
 * 
 * @param {function} callback  a callback to execute
 * @return {function|array}    the callback return or all storage keys
 */
Storage.prototype.keys = function (callback, data) {
    // retrieve all keys
    var keys = []
    for (var key in this.data) keys.push(key)
    
    // if we have a callback given, return it with an optional data object
    if (typeof callback !== 'undefined') {
        if (typeof data === 'undefined') data = {}

        return callback(keys, data)
    }
    
    // return keys only
    return keys
}


/**
 * on function.
 * registers an event handler for this storage object
 *
 * @param {string} event       the event to register a handler for
 * @param {function} callback  the handler to register 
 * @return {this}              for chaining
 */
Storage.prototype.on = function (event, callback) {
    try {
        // push the callback to the event object
        this.events[event] = callback
    }
    
    // if we get an error, the event does not exist. To ease things, we 
    // print an error to the console and show a list of possible events.
    catch (error) {
        var events = []
        for (var event in this.events) events.push(event)
        console.error('Event ' + event + ' does not exist. Available events: ' + events.join(', ') + '.')
    }
    
    // return this for chaining
    return this
}


/**
 * setOption function.
 * sets an option for the storage instance.
 *
 * @param {string} key   the option to set
 * @param {mixed} value  the option value
 * @return {this}        for chaining
 */
Storage.prototype.setOption = function (key, value) {
    this.options[key] = value

    // return this for chaining
    return this
}


module.exports = Storage
