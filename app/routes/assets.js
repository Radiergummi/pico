var fs = require('fs')

Route.get('/css/(:any)', function (stylesheet) {
    try {
        return Response.create(fs.readFileSync(PUB + 'assets/css/' + stylesheet, 'utf8'), 200, { 'Content-Type': 'text/css', 'Cache-Control': 'public, max-age=604800'})
    }
        
    catch (error) {
        return Response.create('error/404', 404, { debugdata: JSON.parse(error) })
    }
})
                
Route.get('/favicon.ico', function () {
    return Response.create('', 204)
})
