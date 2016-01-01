// Use nmap to scan ports

var spawn = require('child_process');

function scanPorts(ops, ans){
	console.log('start nmap');
	opts = {ports:'1-1024', host: '192.168.1.2'};
	var cmd = 'nmap -p' + opts.ports + ' ' + opts.host + ' | grep tcp';
    spawn.exec(cmd, function (err, stdout, stderr){
		if (err) {
			console.log("child processes failed with error code: " + err.code + stderr);
		}
// 		console.log(stdout);
		var ports = stdout.split('\n');
		
		// there is always an empty line at the end, so only go to length-1
		for(var i=0;i<ports.length-1;i++){
			// need to use a regex expression to eat up extra whitespace before split
			var chunk = ports[i].replace(/\s+/g, " ").split(' ');
			console.log( 'chunk: ' + chunk);
			// should be port   status protocol 
			//           22/tcp  open  ssh
			// use slice to take of the last 4 chars (/tcp) of port
			ans.push( { 'port': chunk[0].slice(0,-4), 'protocol': chunk[2]} );
		}
// 		console.log( 'ans: ' + JSON.stringify(ans) );
	});
}

module.exports = scanPorts;




// var nmap = require('libnmap');
// 
// /*
// options
// nmap {String} Path to NMAP binary
// verbose {Boolean} Turn on verbosity during scan(s)
// ports {String} Range of ports to scan
// range {Array} An array of hostnames/ipv4/ipv6, CIDR or ranges
// timeout {Number} Number of minutes to wait for host/port response
// blocksize {Number} Number of hosts per network scanning block
// threshold {Number} Max number of spawned process
// flags {Array} Array of flags for .spawn()
// udp {Boolean} UDP scan mode enabled
// json {Boolean} JSON object as output, false produces XML
// */
// var opts = {
//       range: [
//         '192.168.1.8'
//       ],
//       ports: '1-1024',
//       udp: false,
//       json: true
//     };
// 
// function dump(report){
// 	for (var item in report) {
// 		var line = report[item];
// 		for (var it in line) {
// 			if(it === 'host'){
// 				console.log('--- host --------');
// 				var hostinfo = line[it][0];
// 				for (var i in hostinfo){
// 					if(i === 'ports'){
// 						var ports = hostinfo[i][0];
// 						console.log('--- ports --------');
// 						for (var j in ports) console.log(j + '> ' + JSON.stringify(ports[j]) + '\n');
// 					}
// 					else console.log(i + '> ' + JSON.stringify(hostinfo[i]) + '\n');
// 				}
// 			}
// 			else console.log(it + ': ' + JSON.stringify(line[it]) + '\n');
// 		}
// 	}
// }
// 
// function scan(opts){
// 	nmap.scan(opts, function(err, report) {
// 		if (err) throw new Error(err);
// 		dump(report);
// 	});
// }
// 
// module.exports = scan;


