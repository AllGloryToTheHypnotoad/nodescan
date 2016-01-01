// create a simple REST http server
var http = require('http');                // http-server


// Simple REST server
var server = http.createServer(function(req, res){
    var path = req.url; 
    debug( 'path: ' + path );
    
	if ( path == '/' ){
		if (req.method == 'GET') {
			res.writeHead(200,{'Content-Type': 'text/html'});
			res.write(page(db));
			res.end();
		}
		else if (req.method == 'PUT') {
			req.on('data', function(chunk) {
				debug( chunk.toString() );
			});
		}
	}
    // return error
	else {
		// force users to /
		debug("Wrong path " + path)
		res.writeHead(404, "Not Found", {'Content-Type': 'text/html'});
		res.write("Wrong path: use http://localhost:"+program.port+"\n");
		res.end(); 
	}
});

module.exports = server;


