// Network database (db)

var getMac = require('../lib/mac.js');   // get vendor names from mac addr 
var nmap = require('../lib/nmap.js');    // use nmap to scan ports
var fs = require('fs');                  // get access to filing system
var getHostName = require('../lib/getHostName.js');   // use os tools to get host name

// private database
var db = {};

// Instantiate as: var obj = new DataBase()
// This class is an abstract which could be replaced with a real database if
// needed because of large number of hosts on network.
var DataBase = function(){}

// return an array sorted by IP addr
DataBase.prototype.getSortedList = function(){
	var s = [];
	Object.keys(db).forEach(function(key){
		s.push(db[key]);
	});
	s.sort(function(a,b){
		var aa = parseInt(a.ip.split('.')[3]);
		var bb = parseInt(b.ip.split('.')[3]);
		return aa - bb;
	});
	console.log(s);
	return s;
}

// update the db with a scan --- old clan
DataBase.prototype.update = function(scan){
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
	
	Object.keys(db).forEach(function(key){	
		// only search if vendor is empty
		if(db[key].vendor === ''){
			getMac(key).then(function(response){ db[key]['vendor']=response; });
		}
	});
	
	Object.keys(db).forEach(function(key){
		if(db[key].hostname === ''){ 
			getHostName( db[key].ip ).then( function (response){ db[key].hostname = response; } );
		}
	});
	;
}

// add host to db
// DataBase.prototype.push = function(host){
// 	db[host['mac']] = host;
// }

// is this really useful for my use cases?
DataBase.prototype.getHost = function(mac){
	return db[mac];
}

// write to a file
DataBase.prototype.write = function(file){
	var s = JSON.stringify(db);
	fs.writeFile(file,s);
}

// read db from a file
DataBase.prototype.read = function(file){
	var p = require(file);
	if(p) db = p;
}

// print out db to console
DataBase.prototype.console = function(){
	console.log(JSON.stringify(db, null, 4));
}

DataBase.prototype.get = function(){
	return db;
}

//module.exports = DataBase;
module.exports.DataBase = new DataBase();