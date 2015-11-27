var colors = require('colors')

eventDispatcher.on('server:listening', function(event, data) {
    console.info('Server listening at ' + data.url.cyan + ':' + data.port.toString().white)
})

eventDispatcher.on('server:request', function(event, req) {
    console.log(Helper.readableDate().gray + ' < ' + req.method.inverse + ' ' + req.url.cyan.bold)
})

eventDispatcher.on('server:response', function(event, res) {
    console.log(Helper.readableDate().gray + ' > ' + res.status.toString().cyan)
})

Cache.on('cleanup', function () {
    console.info(Helper.readableDate().gray + ' Cache cleaned up. Next cleanup in 10s...'.cyan)
})
