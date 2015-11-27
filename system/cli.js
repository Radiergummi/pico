require('colors')

var CLI = {
    log: function (data) {
    
        console.log(data)
    },

    error: function (data) {},
    trace: function (data) {},
    info: function (data) {},
    warn: function (data) {},
    
    format: function (data, color, indentation) {
        switch (typeof data) {
            case 'string':
            case 'number':
               data = data.toString().yellow
               break

            case 'object':
               data = JSON.stringify(data, null, 2).yellow
               break

            default:
        }
                                                                                                            }
}

module.exports = CLI
