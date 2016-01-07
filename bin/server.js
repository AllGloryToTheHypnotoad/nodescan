#!/usr/bin/env node

var debug = require('debug')('kevin:main'); // debugging
//var chalk = require('chalk');            // colors
var program = require('commander');        // CLI access
var os = require('os');                    // OS access
var http = require('http');                // http-server
var spawn = require('child_process');
var localhostInfo = require('../lib/getHostInfo.js');
var page = require('../lib/page.js');         // render a webpage 
var arpscan = require('../lib/arpscan.js');   // perform the arp scan
var db = require('../lib/database.js').DataBase; // data base 

// grab info from npm package
var pck = require('../package.json');

program
	.version(pck.version)
	.description(pck.description)
	.usage(pck.name + ' [options]')
	.option('-p, --port <port>','Http server port number, default: 8888',parseInt,8888)
	.option('-u, --update [seconds]','update time for arp-scan, default: 60 sec', parseInt, 60)
	.option('-d, --dev [interface]','network interface to use for scan, default: en1', 'en1')
	.parse(process.argv);

debug('Starting netscan on interface: '+program.dev+' every '+program.update);	

var options = {'dev': program.dev};
var scan = [];

// ----- not using nmap yet ----------
// var nmap = require('../lib/nmap.js').Nmap;
//
// nmap.scanNetwork().then(function(res){
// 	for(i in res)debug(res[i]);
// });



/*
Iterate through scan and add new mac addresses into db dictionary
I am having a hell of time with this damn non-blocking shit, it may take a reload or two
to get the vendor name right.

pi@hypnotoad ~ $ avahi-resolve-address 192.168.1.8
192.168.1.8	calculon.local

[kevin@Tardis archeyjs]$ dig +short -x 192.168.1.3 -p 5353 @224.0.0.251
Tardis.local.

Flow:
1. reset host up flag to down
2. iterate through scan results to see if new host found
 - if host exists, mark it as up
 - if host doesn't exist, add to db
3. iterate through db and update vendor id if needed (should only have to do once)
4. iterate through db and update hostname if needed (should only have to do once)
 - linux uses avahi tools
 - osx uses dig
5. iterate through db and scan host for open tcp/udp ports 

*/

var saveFile = '../network_db.json'

function mapNetwork(){	
	debug('network scan start ...');
	arpscan(options).then(function(response){
		scan = response;
		debug('Scan done: '+scan.length+' hosts found');
		db.update( scan ); // pops hosts off scan, so it is 0
		db.write(saveFile);
	});
}

var hostinfo = localhostInfo();
// console.log(hostinfo);

db.read(saveFile);
db.push( hostinfo );
mapNetwork();

setInterval(function(){
	mapNetwork();
}, program.update*1000);



// Simple REST server
var server = http.createServer(function(req, res){
    var path = req.url; 
//     debug( 'path: ' + path );
    
	if ( path == '/' ){
		if (req.method == 'GET') {
			res.writeHead(200,{'Content-Type': 'text/html'});
			res.write(page(db.getSortedList()));
// 			debug(db.get());
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

// start web server
server.listen(program.port);


