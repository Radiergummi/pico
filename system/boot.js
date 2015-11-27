// load the config management
Config = require(SYS + 'config.js')
Input = require(SYS + 'input.js')
Router = require(SYS + 'router.js')
Route = require(SYS + 'route.js')
Helper = require(SYS + 'helper.js')
Session = require(SYS + 'session.js')
View = require(SYS + 'view.js')
Request = require(SYS + 'request.js')
Response = require(SYS + 'response.js')
Cache = require(SYS + 'cache.js').setOption('ttl', 10000)
eventDispatcher = require(SYS + 'eventDispatcher.js')

// load all app config data
Config.load(APP + 'config')

