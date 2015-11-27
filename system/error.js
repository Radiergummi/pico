var Err = function (message, stack) {
    this.message = message
    this.stack = stack
}

Err.prototype = {
    constructor: Err,
    
    log: function()
}
