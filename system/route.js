//var Helper = require(SYS + 'helper.js')
//var Router = require(SYS + 'router.js')
//var Response = require(SYS + 'response.js')
//var View = require(SYS + 'view.js')

var Route = function (callbacks, args) {
    this.callbacks = callbacks
    this.args = args
}

// static collections
Route.collections = {}

Route.get = function(patterns, args) {
  (new Route(0, 0)).register('get', patterns, args)
}

Route.post = function(patterns, args) {
  (new Route(0, 0)).register('post', patterns, args)
}

Route.error = function(patterns, args) {
  (new Route(0, 0)).register('error', patterns, args)
}

Route.prototype = {
    callbacks: null,
    args: null,


    constructor: Route,


    register: function(method, patterns, args) {
      method = method.toUpperCase()

      // convert patterns to object if necessary
      if (typeof patterns !== 'object') {
        patterns = (new Function('return ["' + patterns + '"]')())
      }

      if (typeof args === 'function') {
        args = { main: args }
      }
      

      // add collection actions
      args = Helper.extend(args, Route.collections)
      
      if (! Router.routes.hasOwnProperty(method)) {
        Router.routes[method] = {}
      }
  
      for (var pattern in patterns) {
        Router.routes[method][patterns[pattern]] = args
      }
    },


    action: function(name, callback) {
      Router.actions[name] = callback
    },


    collection: function(actions, definitions) {
      Route.collections = actions
      
      definitions.call(global)
      
      Route.collections = {}
    },


    before: function() {
        if (! this.callbacks.hasOwnProperty('before')) {
            return
        }
                                
        for (var action in this.callbacks.before.split(',')) {
            var response = Router.actions[action].call(global, this.args)
            
            if (typeof response !== 'undefined') return response
        }
    },


    after: function(response) {
        if (! this.callbacks.hasOwnProperty('after')) {
            return
        }
        
        for (var action in this.callbacks.split(',')) {
            Router.actions[action].call(global, response)
        }
    },


    run: function() {
        var response = this.before()

        if (typeof response === 'undefined') {

            response = this.callbacks.main.call(global, this.args)
        }

        this.after(response)

        if (response instanceof View) {
            return Response.create(response.render())
        }

        if (response instanceof Response) {
            return response
        }

        return Response.create(response)
    }
}

module.exports = Route
