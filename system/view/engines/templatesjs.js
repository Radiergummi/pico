// require the templates.js engine
var engine = require(PATH + 'components/templatesjs/templates.js')

module.exports = {
    render: function (template, data) {

        // run the lib specific render method
        return engine.parse(template, data)
    }
}
