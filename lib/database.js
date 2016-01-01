// Network database (db)

var fs = require('fs');

// Instantiate as: var obj = new DataBase()
// This class is an abstract which could be replaced with a real database if
// needed because of large number of hosts on network.
function DataBase(){
	this.db = {}; // make private?
}

// return an array sorted by IP addr
DataBase.prototype.sortedList = function(){
	;
}

// update the db with a scan
DataBase.prototype.update = function(scan){
	;
}

// add host to db
DataBase.prototype.push = function(host){
	this.db[host['mac']] = host;
}

// is this really useful for my use cases?
DataBase.prototype.getHost = function(mac){
	return this.db[mac];
}

DataBase.prototype.write = function(file){
	var s = JSON.stringify(this.db);
	fs.writeFile(file,s);
}

DataBase.prototype.read = function(file){
	var p = require(file);
	if(p) this.db = p;
}

DataBase.prototype.console = function(){
	console.log(JSON.stringify(this.db, null, 4));
}

module.exports = DataBase;