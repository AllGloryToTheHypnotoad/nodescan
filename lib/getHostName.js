// Use os specific programs to determine hostname from IP address

var spawn = require('child_process');              // spawn process
var os = require('os');                            // OS access
var debug = require('debug')('kevin:getHostName'); // debugging

function getHostName(ip){
	return new Promise( function(resolve,reject){
		var hostname = '';
		switch(os.type().toLowerCase()){
			case 'linux':
				spawn.exec('avahi-resolve-address ' + ip +" | awk '{print $2}'", function (err, stdout, stderr){
					if(err) debug('['+ip+' hostname not found]: '+stderr);
					else hostname = stdout;
					resolve(hostname);
				});
				break;
			case 'darwin':
				spawn.exec('dig +short -x ' + ip +" -p 5353 @224.0.0.251", function (err, stdout, stderr){
					if(err) debug('['+ip+' hostname not found]: '+stderr); 
					else hostname = stdout;
					resolve(hostname);
				});
				break;
		}
	});
}

module.exports = getHostName;


