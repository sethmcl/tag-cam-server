// @author Seth McLaughlin

var hostname    = require('os').hostname(),
    fs          = require('fs'),
    path        = require('path'),
    http        = require('http');
    express     = require('express'),
    consolidate = require('consolidate'),
    PORT        = 4099;

// The Venus application object  
function Server() {};

// Start the application  
Server.prototype.run = function(args) {
  this.initEnvironment();
  this.initRoutes();
  this.start();
};

// Initialize Express Server
Server.prototype.initEnvironment = function(config) {
  var app        = this.app = express(),
      homeFolder = __dirname;

  // express config
  app.engine('tl', consolidate.dust);
  app.set('view engine', 'tl');
  app.set('views', homeFolder + '/views');
  app.set('views');
  app.set('view options', { layout: null });

  app.use (function(req, res, next) {
      var data='';
      req.setEncoding('utf8');
      req.on('data', function(chunk) {
         data += chunk;
      });

      req.on('end', function() {
          req.body = data;
          next();
      });
  });

  // static resources
  app.use('/js', express.static(homeFolder + '/js'));
  app.use('/css', express.static(homeFolder + '/css'));
  app.use('/img', express.static(homeFolder + '/img'));
  app.use('/temp', express.static(homeFolder + '/temp'));

  // port
  this.port = PORT;
};

// Initialize URL routes
Server.prototype.initRoutes = function () {
  var app = this.app;

  app.get('/', function (request, response) {
    response.render('index', { hostname: hostname });
  });
}

// Start Express server
Server.prototype.start = function (port) {
  var app = this.app, server;
  server = http.createServer(app);
  server.listen(this.port);
}

module.exports = Server;
Object.seal(module.exports);
