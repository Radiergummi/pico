Route.get('/', function() {
  vars = Config.get('app')
  var words = ['Welcome', 'Bienvenue', 'Willkommen', 'Bienvenido']
  vars.welcome = Helper.shuffle(words)[0]
    
  return View.create('home', vars)
    .partial('partials/header', vars, 'header')
    .partial('partials/footer', vars, 'footer')
})

Route.post('/save/data/(:num)', function(id) {
    return 'data saved for id ' + id
})

//Route.get('/favicon.ico', function() {
//    return ''
//})

Route.error('404', function() {
    return Response.error(404)
})
