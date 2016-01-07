// Use os specific programs to determine host info

var os = require('os');                            // OS access

// arp-scan and nmap don't get localhost info

function getHostInfo(){
	var localhostInfo = {hostname: os.hostname(), vendor: '', timestamp: new Date(), status:'up', tcp: {}, udp: {}};
	// get local info
	var ifaces = os.networkInterfaces();
	for(var i in ifaces){
		var eth = ifaces[i];
		for(var info in eth){
			var dev = eth[info];
			if(dev.family === 'IPv4' && dev.internal === false)
				localhostInfo.ip = dev.address;
				localhostInfo.mac = dev.mac.toUpperCase();
			if(dev.family === 'IPv6' && dev.internal === false)
				localhostInfo.ipv6 = dev.address;
		}
	}
	return localhostInfo;
}

module.exports = getHostInfo;


