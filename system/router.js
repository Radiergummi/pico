//var Helper = require(SYS + 'helper.js')
//var Route = require(SYS + 'route.js')

var Router = function(method, uri) {
  this.actions = {}
  
  this.uri = uri
  this.method = method.toUpperCase()
}

Router.routes = {}
Router.create = function() {
  return new Router(Input.getMethod(), Input.getUri())
}
    

Router.prototype = {
  actions: null,
  
  constructor: Router,

  patterns: {
    ':any': '[^/]+',
    ':num': '[0-9]+',
    ':all': '.*'
  },
  
  getRoutes: function () {
    var routes = []
    
    if (Router.routes.hasOwnProperty(this.method)) {
      routes = Helper.extend(routes, Router.routes[this.method])
    }
    
    if (Router.routes.hasOwnProperty('ANY')) {
      routes = Helper.extend(routes, Router.routes.ANY)
    }
    
    return routes
  },

  match: function () {
        var uri = this.uri,
            method = this.method,
            routes = this.getRoutes(method)

        if (routes.hasOwnProperty(uri)) {
            return new Route(routes[uri])
        }
        
        for (var route in routes) {
            var action = routes[route]
            
            if (route.indexOf(':') > -1) {
                
                for (var pattern in this.patterns) {
                    route = route.replace(pattern, this.patterns[pattern])                
                }
            }

            var match = uri.match(new RegExp('^' + route + '$'))

            if (match !== null) {
                return new Route(action, match.slice(1))
            }
        }

        if (Router.routes.hasOwnProperty('ERROR')) {
            if (Router.routes.ERROR.hasOwnProperty('404')) {
                return new Route(Router.routes.ERROR['404'])
            }
        }
        
        throw new Error('No routes matched')
  },
  
  dispatch: function () {
      return this.match().run()
  }
}

module.exports = Router
