// load the mustache.js engine
var engine = require(PATH + 'components/mustachejs/mustache.js')

module.exports = {
    render: function (template, data) {
    
        // run the lib specific render method
        return engine.render(template, data)
    }
}
