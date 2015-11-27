var Status = require(SYS + 'response/status.js')

var Response = function (output, status, headers) {
    if (typeof status === 'undefined') {
        status = 200
    }
    
    if (typeof headers === 'undefined') {
        headers = {}
    }

    this.status = status
    this.output = output
    this.headers = {}
    
    for (var name in headers) {
        this.headers[name.toLowerCase()] = headers[name]
    }
}

Response.create = function (output, status, headers) {
    return new Response(output, status, headers)                        
}

Response.redirect = function (uri, status) {
    if (typeof status === 'undefined') {
        status = 302
    }
    
    return Response.create('', status, { Location: uri })
}

Response.error = function (status, vars) {
    return Response.create(
        View.create('error/' + status, vars).render(),
        status
    )
}

Response.json = function (output, status) {
    try {
        output = JSON.parse(output)
    }
    
    finally {
        return Response.create(
            output,
            status,
            {
                'content-type': 'application/json; charset=' + Config.get('app.encoding', 'UTF-8')
            }
        )
    }
}

Response.prototype = {
    constructor: Response,
    
    setHeader: function (key, value) {
        this.headers[key] = value
    },

    send: function (res) {
        
        if (! this.headers.hasOwnProperty('content-type')) {
            this.headers['Content-Type'] = 'text/html; charset=' + Config.get('app.encoding', 'UTF-8')
        }

        if (! this.headers.hasOwnProperty('Vary')) {
            this.headers['Vary'] = 'Accept-Encoding'
        }

        res.writeHead(
            this.status,
            Status.create(this.status).getMessage(),
            this.headers
        )
        
        //for (var cookie in Cookie.bag) {
        //    // TODO: Set cookies
        //}
        
        if (this.output) {
            res.end(this.output)
        }
    }
}

module.exports = Response
