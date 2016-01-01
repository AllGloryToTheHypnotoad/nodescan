// Mac addr lookup

var request = require('request');

// get vendor name from mac addr, arp-scan/nmap don't always get the correct thing
// or anything at all
function macVendorLookup(mac, cb){
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

module.exports = macVendorLookup;