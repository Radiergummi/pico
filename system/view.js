//var Helper = require(SYS + 'helper.js')
//var Config = require(SYS + 'config.js')
var fs = require('fs')

var View = function (template, vars) {
    if (typeof this.vars === 'undefined') this.vars = {}

    var templateExtension = Config.get('app.views.extension', '.html')
    this.template = APP + 'views/' + template + templateExtension
    this.vars = Helper.extend(this.vars, vars)
}

View.templateEngine = false

View.create = function (template, vars) {
    return new View(template, vars)
}

View.prototype = {
    vars: {},

    constructor: View,
    
    engine: function () {
        if (View.templateEngine === false) {
            View.templateEngine = require(
                SYS + 'view/engines/' + Config.get('app.views.engine', 'default') + '.js'
            )
        }
        
        return View.templateEngine
    },


    partial: function (template, vars, name) {
        if (typeof vars === 'undefined') {
            vars = {}
        }
        
        if (typeof name === 'undefined') {
            name = template
        }
        
        this.vars[name] = View.create(template, vars).render()
        
        return this
    },
    
    
    render: function () {
        var template = ''
        
        try {
            template = fs.readFileSync(this.template, 'utf8')
        }
                            
        catch (error) {
            throw new Error('template file "' + this.template + '" could not be read: ' + error)
        }

        return this.engine().render(template, this.vars)
    }
}

module.exports = View
