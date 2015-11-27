var fs = require('fs')

var Config = function () {
    if (! (this instanceof Config)) {
        return new Config()
    }
}

Config.data = {}

Config.prototype = {
	constructor: Config,

	get: function (keys, fallback) {
		var object = Config.data

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
	},

	set: function (key, value) {
		/*if (! Config.data.hasOwnProperty(key)) */
		Config.data[key] = value
	},

	has: function (key) {
		return Config.data.hasOwnProperty(key)
	},

	load: function (path) {
		path = path.replace('/\/+$/', '') + '/'

		var files = fs.readdirSync(path)

		for (var item in files) {

			var file = files[item],
			    filename = file.split('.'),
			    extension = filename.pop(),
			    basename = filename.join('.')

			if (extension !== 'json') continue

			Config.data[basename] = JSON.parse(fs.readFileSync(path + file, 'utf8'))
		}
	}
}

module.exports = new Config()
