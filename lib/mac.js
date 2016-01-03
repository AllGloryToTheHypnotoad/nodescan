// Mac addr lookup

var request = require('request');

// get vendor name from mac addr, arp-scan/nmap don't always get the correct thing
// or anything at all
// input: mac (mac addr)
// output: vender string
function macVendorLookup(mac){
	var ret = '';
	return new Promise(function(resolve,reject){
		request('http://api.macvendors.com/'+mac, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
			ret = body;
		  }
		  resolve(ret);
		});
	});
}

module.exports = macVendorLookup;