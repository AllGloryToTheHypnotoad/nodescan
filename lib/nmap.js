// Use nmap to scan ports and network
var debug = require('debug')('kevin:nmap'); // debugging
var spawn = require('child_process');       // command line

// Empty class holding the various nmap commands
var Nmap = function(){}

/*
Use nmap to scan a network for hosts and return their info

nmap -sn 192.168.1.1/24

Starting Nmap 7.00 ( https://nmap.org ) at 2016-01-05 11:15 MST
Nmap scan report for 192.168.1.1
Host is up (0.0041s latency).
MAC Address: 6C:70:9F:CE:DA:85 (Apple)
Nmap scan report for 192.168.1.2
Host is up (0.0041s latency).
MAC Address: C8:2A:14:1F:18:69 (Apple)
Nmap scan report for 192.168.1.6
Host is up (0.0066s latency).
MAC Address: 34:12:98:03:B3:B8 (Apple)

input: opts {range: 192.168.1.1/24 }
output: array of hosts: [{ip,mac,vendor},{ip,mac,vendor}, ...]
*/
Nmap.prototype.scanNetwork = function(opts){
	return new Promise( function(resolve,reject){
		var ans = [];
// 		debug('nmap start -----------------------------------------');
		opts = opts || {range: '192.168.1.1/24'};
		var cmd = 'nmap -sn ' + opts.range;
		spawn.exec(cmd, function (err, stdout, stderr){
			if (err) {
				debug(opts.host + ', error code: ' + err.code + stderr);
				reject( ans ); // return empty array
			}
			var info = stdout.split('\n');
			// there is always an empty line and summary at the end, so only go to length-2
			var i = 0;
			while(i < info.length-3){
				var host = {};
				var line = info[i].split(' ');
				if(line[0] === 'Nmap'){
					host.ip = line[4];
					line = info[i+2].split(' ');
					if(line[0] === 'MAC'){
						host.mac = line[2];
						host.vender = info[i+2].split('(')[1].replace(')',''); // some strings are multiple words with spaces in them
						ans.push(host); // only add if we get everything
						i += 3;
					}
					else i++;
				}
				else i++;
			}
			resolve( ans );
		});
	});
}


/**
Use promise to scan and return the nmap response, an array of dicts

input: opts {ports: '1-100', host: '10.10.1.1'}
output: [{"port":"53","protocol":"domain"}] or []
*/
Nmap.prototype.scanPorts = function(opts){
	return new Promise( function(resolve,reject){
		var ans = [];
// 		debug('nmap start -----------------------------------------');
		opts = opts || {ports:'1-3000', host: '192.168.1.1'};
		var cmd = 'nmap -p' + opts.ports + ' ' + opts.host + ' | grep tcp';
		spawn.exec(cmd, function (err, stdout, stderr){
			if (err) {
				debug(opts.host + ', error code: ' + err.code + stderr);
				reject( ans ); // return empty array
			}
			var ports = stdout.split('\n');
			ans.push( opts.host );
			// there is always an empty line at the end, so only go to length-1
			for(var i=0;i<ports.length-1;i++){
				// need to use a regex expression to eat up extra whitespace before split
				var chunk = ports[i].replace(/\s+/g, " ").split(' ');
// 				debug( 'chunk: ' + chunk);
				// should be port   status protocol 
				//           22/tcp  open  ssh
				// use slice to take of the last 4 chars (/tcp) of port
				ans.push( {'port': chunk[0].slice(0,-4), 'protocol': chunk[2]} );
			}
// 			debug( 'nmap ans: ' + JSON.stringify(ans) );
			resolve( ans );
		});
	});
}

module.exports.Nmap = new Nmap();
