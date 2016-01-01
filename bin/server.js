#!/usr/bin/env node

/*
my apple tv and extreme seem to have save mac addr ... wtf?

pi@hypnotoad ~ $ sudo arp-scan -l -I eth0
Interface: eth0, datalink type: EN10MB (Ethernet)
Starting arp-scan 1.8.1 with 256 hosts (http://www.nta-monitor.com/tools/arp-scan/)
192.168.1.1	6c:70:9f:ce:da:85	(Unknown)   <<<<< here
192.168.1.2	c8:2a:14:1f:18:69	Apple Inc
192.168.1.6	34:12:98:03:b3:b8	(Unknown)
192.168.1.8	b8:27:eb:0a:5a:17	(Unknown)
192.168.1.13	b8:27:eb:8f:23:20	(Unknown)
192.168.1.9	60:5b:b4:9f:f2:21	(Unknown)
192.168.1.21	7c:d1:c3:4a:13:2c	(Unknown)
192.168.1.51	6c:70:9f:ce:da:85	(Unknown)  <<<< here
192.168.1.3	f8:1e:df:ea:68:20	Apple, Inc
192.168.1.90	00:21:5a:fe:bc:4a	Hewlett Packard
192.168.1.30	8c:2d:aa:a1:33:af	(Unknown)
192.168.1.22	68:d9:3c:4b:35:a8	(Unknown)

18 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.8.1: 256 hosts scanned in 2.140 seconds (119.63 hosts/sec). 12 responded
 
pi@hypnotoad ~ $ avahi-resolve-address 192.168.1.51
192.168.1.51	Office-Apple-TV.local
pi@hypnotoad ~ $ avahi-resolve-address 192.168.1.1
192.168.1.1	AirportExtreme.local


*/

var debug = require('debug')('kevin:mon'); // debugging
//var chalk = require('chalk');            // colors
var program = require('commander');        // CLI access
var os = require('os');                    // OS access
var http = require('http');                // http-server
var spawn = require('child_process');

var page = require('../lib/page.js');   // 
var arpscan = require('../lib/scan.js');   // 
var nmap = require('../lib/nmap.js');   // 

// grab info from npm package
var pck = require('../package.json');

program
	.version(pck.version)
	.description(pck.description)
	.usage(pck.name + ' [options]')
	.option('-p, --port <port>','Http server port number, default: 8080',parseInt,8080)
// 	.option('-r, --no-static','Do real-time webpage updates')
	.option('-u, --update [seconds]','update time for arp-scan, default: 60 sec', parseInt, 500)
	.option('-d, --dev [interface]','network interface to use for scan, default: en1', 'en1')
	.parse(process.argv);

debug('Starting netscan on interface: '+program.dev+' every '+program.update);	
// debug('argv: '+process.argv);
// debug('!rt: '+ program.static);
// debug('rt: ' + (program.realtime ? true : false) );
// debug('test: '+ program.test);
// debug('archeyjs ready on port: '+ program.port);

var options = {'dev': program.dev};
var scan = [];
var db = {};

var request = require('request');

// get vendor name from mac addr, arp-scan/nmap don't always get the correct thing
// or anything at all
function getMAC(mac, cb){
// 	var ret = '';
	request('http://www.macvendorlookup.com/api/v2/'+mac, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
// 		console.log(JSON.parse(body)[0]['company'])  
		ret = JSON.parse(body)[0]['company'];
	  }
	  else ret = 'unknown';
	  console.log('getMac: '+ret);
	  cb(ret);
	});
}


var opts = {};
var ans = [];

nmap(opts,ans);

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
function cleanDB(db,scan){
	// clear status flag
	Object.keys(db).forEach(function(key){
		db[key].status='down';
	});
	
	while(scan.length > 0){
		var host = scan.pop();
		if( host['mac'] in db ) host['mac'].status = 'up';
		else {
// 			db[ host['mac'] ] = {'ip': host['ip'], 'vendor': host['vendor']};
			db[ host['mac'] ] = {'ip': host['ip'], 'vendor': '', 'hostname': '', 'timestamp': new Date(), 'mac': host['mac'], 'status':'up', 'tcp': {}, 'udp': {}};
		}
	}
// 	Object.keys(db).forEach(getMAC(key,function(vendor){db[key]['vendor']=vendor;}));
	Object.keys(db).forEach(function(key){
		
		// only search if vendor is empty
		if(db[key].vendor === ''){
			request('http://www.macvendorlookup.com/api/v2/'+key, function (error, response, body) {
			  if (!error && response.statusCode == 200) { 
				ret = JSON.parse(body)[0]['company'];
			  }
			  else ret = 'unknown';
			  console.log('getMac: '+ret);
			  db[key]['vendor']=ret;
			});
		}
	});
	
	// use avahi tools to determine host name
	if(os.type().toLowerCase() === 'linux'){
		Object.keys(db).forEach(function(key){
			if(db[key].hostname === ''){
				spawn.exec('avahi-resolve-address ' + db[key].ip +" | awk '{print $2}'", function (err, stdout, stderr){
					if(!err) db[key].hostname = stdout;
				});
			}
		});
	}
	// dig +short -x 192.168.1.3 -p 5353 @224.0.0.251
	else if(os.type().toLowerCase() === 'darwin'){
		Object.keys(db).forEach(function(key){
			if(db[key].hostname === ''){
				spawn.exec('dig +short -x ' + db[key].ip +" -p 5353 @224.0.0.251", function (err, stdout, stderr){
					if(!err) db[key].hostname = stdout;
				});
			}
		});
	}
}
// why don't these work??
// this seems to miss localhost
arpscan(options, scan);
cleanDB(db,scan);

setInterval(function(){
	debug('arp-scan ... now');
	// spawn - streams output
	// exec - buffers output, buffer size limited
	arpscan(options, scan);
	debug(scan);
// 	debug('scan len= '+scan.length);
	cleanDB(db,scan);
// 	debug('scan len2= '+scan.length);
// 	debug( db );
}, program.update*1000);



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

// start web server
server.listen(program.port);


