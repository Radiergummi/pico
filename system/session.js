Storage = require(SYS + 'storage.js')

var Session = function (sessionID) {
		// create a storage object
		this.storage = new Storage({ttl:0})
		
		// if we have a session ID and there is a storage entry for it, use the existing
		// session as long as it is not expired
		if (typeof sessionID !== 'undefined' && this.storage.has(sessionID)) {
			
			// TODO: reuse existing session
		} else {
				this.create()
		}
}

Session.prototype = {
		constructor: Session,
		storage: null,
		id: null
}

/**
 * create function.
 * creates a new session object
 */
Session.prototype.create = function () {
		// create a session id
		this.id = this.createSessionId()
		
		// create a new session object
		this.storage.set(this.id, {})
}

Session.prototype.createSessionId = function () {
	var characters = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
			id = ''
	
		for (var i = 0; i < 12; i++) {
				id += characters.charAt(Math.floor(Math.random() * characters.length) + 1)
		}
	
		return id
}

Session.prototype.get = function (key, fallback) {
		return this.storage.get(this.id + '.' + key, fallback)
}

Session.prototype.set = function (key, value) {
		return this.storage.set(this.id + '.' + key, value)
}

Session.prototype.has = function (key) {
		return this.storage.has(this.id + '.' + key)
}

Session.prototype.del = function (key) {
		return this.storage.del(this.id + '.' + key)
}

Session.prototype.keys = function () {
		return this.storage.keys(this.id)
}

Session.prototype.flush = function () {
		return this.storage.set(this.id, {})
}


module.exports = Session