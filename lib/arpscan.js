// Use arp-scan to find hosts on the network
var spawn = require('child_process');

/*
Uses arp-scan to detect hosts on the local network

arp-scan -l I en0

where:

-l use local host info to determine network parameters
-I <dev> use the network interface <dev>

input: ops {dev: iface }
output: array of hosts: [{ip,mac,vendor},{ip,mac,vendor}, ...]
*/
function scan(ops){
	var ans = [];
	return new Promise(function(response,reject){
		spawn.exec('arp-scan -l -I ' + ops.dev, function (err, stdout, stderr){
			if (err) {
				console.log("child processes failed with error code: " +
					err.code + stderr);
			}
			var net = stdout.split('\n');
			for(var i=2;i<net.length-4;i++){
				var chunk = net[i].split('\t');
				ans.push( { 'ip': chunk[0], 'mac': chunk[1].toUpperCase(), 'vendor': chunk[2]} );
			}
			response(ans);
		});
	});
}

module.exports = scan;


