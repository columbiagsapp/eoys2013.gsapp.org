
/**
 * Module dependencies.
 */

var express = require('express')
  , engine = require('ejs-locals')
  , routes = require(__dirname + '/routes/router')
  //, user = require(__dirname + '/routes/user')
  , http = require('http')
  , path = require('path');


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 2703);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('ejs', engine);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('urbanextremity'));
  app.use(express.session({ secret: 'ytic' }));
  
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
  //set up serving of static files from project directory
  app.use('/views/templates', express.static(__dirname + '/views/templates'));


  app.use(app.router);

});

app.configure('development', function(){
  app.use(express.errorHandler());
});



app.get('/', routes.get);
app.get('/eoys2013*', routes.get);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


