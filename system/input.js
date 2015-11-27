var url = require('url')
var qs = require('querystring')

var Input = function () {}

Input.prototype = {
  constructor: Input,
  
  detect: function (request) {

    // parse the request string
    var parts = url.parse(request.url, true)
    
    // retrieve the pure uri
    this.uri = parts.pathname

    // retrieve the method used
    this.method = request.method
      
    // retrieve the raw uri string
    this.raw = request.url

    switch (this.method) {
        case 'GET':
        case 'HEAD':
            // parse the request URI, including parameters
            this.data = parts.query
            break;
        
        default:   
            try {
                var body = ''

                request.on('data', function (data) {
                    body += data

                    // kill the connection for too large requests
                    if (body.length > 5e6) return request.connection.destroy()
                })
        
                reqest.on('end', function () {
                    this.data = qs.parse(body)
                })
            }
      
            catch (error) {
                console.trace('Could not parse request input: ' + error)
            }
        }

    return this
  },
  
  getUri: function () {
    return this.uri
  },
  
  getMethod: function () {
    return this.method
  },
  
  get: function (key, fallback) {
    if (typeof key === 'undefined') return this.data
    
    if (this.data.hasOwnProperty(key)) return this.data[key]
    
    if (typeof fallback !== 'undefined') return fallback
    
    return  
  }, 
  
  flash: function () {
    //Session.flash(this.data)
  },
  
  previous: function (key, fallback) {
    //var previousData = Session.flash()
    
    if (previousData.hasOwnProperty(key)) return previousData[key]
    
    if (typeof fallback !== 'undefined') return fallback
    
    return
  }
}

module.exports = new Input()
