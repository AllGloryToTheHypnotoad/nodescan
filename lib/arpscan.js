// Use arp-scan to find hosts on the network
var spawn = require('child_process');



function scan(ops, ans){
    spawn.exec('arp-scan -l -I ' + ops.dev, function (err, stdout, stderr){
		if (err) {
			console.log("child processes failed with error code: " +
				err.code + stderr);
		}
// 		console.log(stdout);
// 		var ans = [];
		var net = stdout.split('\n');
		for(var i=2;i<net.length-4;i++){
			var chunk = net[i].split('\t');
			ans.push( { 'ip': chunk[0], 'mac': chunk[1].toUpperCase(), 'vendor': chunk[2]} );
		}
// 		console.log( ans );
// 		return ans;
	});
}

module.exports = scan;


