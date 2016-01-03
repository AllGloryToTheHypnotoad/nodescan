// Use nmap to scan ports
var debug = require('debug')('kevin:nmap'); // debugging
var spawn = require('child_process');       // command line
// 
// // could do TCP and UDP
// function scanPorts(opts){
// 	var ans = [];
// 	debug('start nmap');
// 	opts = opts || {ports:'1-1024', host: '192.168.1.2'};
// 	var cmd = 'nmap -p' + opts.ports + ' ' + opts.host + ' | grep tcp';
//     spawn.exec(cmd, function (err, stdout, stderr){
// 		if (err) {
// 			debug("child processes failed with error code: " + err.code + stderr);
// 		}
// // 		console.log(stdout);
// 		var ports = stdout.split('\n');
// 		
// 		// there is always an empty line at the end, so only go to length-1
// 		for(var i=0;i<ports.length-1;i++){
// 			// need to use a regex expression to eat up extra whitespace before split
// 			var chunk = ports[i].replace(/\s+/g, " ").split(' ');
// 			debug( 'chunk: ' + chunk);
// 			// should be port   status protocol 
// 			//           22/tcp  open  ssh
// 			// use slice to take of the last 4 chars (/tcp) of port
// 			ans.push( { 'port': chunk[0].slice(0,-4), 'protocol': chunk[2]} );
// 		}
// // 		console.log( 'ans: ' + JSON.stringify(ans) );
// 		debug( 'ans: ' + JSON.stringify(ans) );
// 	});
// 	
// 	return ans;
// }

/**
Use promise to scan and return the nmap response, an array of dicts
return: [{"port":"53","protocol":"domain"}] or []
*/
function scanPorts(opts){
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

module.exports = scanPorts;
