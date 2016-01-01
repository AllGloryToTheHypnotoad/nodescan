// Create an HTML5 webpage 

// Build each row of the table
function line(a,b,c,d){
	return '<tr><td>' + a + '</td><td>' + b + '</td><td>' + c + '</td><td>' + d + '</td></tr>';
}

// sorts the ip addresses in order
function sortIP(info){
	var s = [];
	Object.keys(info).forEach(function(key){
// 		s.push({'ip':info[key]['ip'], 'mac': key, 'vendor': info[key]['vendor']});
		s.push(info[key]);
	});
	s.sort(function(a,b){
		var aa = parseInt(a.ip.split('.')[3]);
		var bb = parseInt(b.ip.split('.')[3]);
		return aa - bb;
	});
	console.log(s);
	return s;
}

// build the table of network info
// this iterates over all of the keys
function table(info){
	var t = '<table class="center">';
// 	Object.keys(info).forEach(function(key){t+=line(info[key]['ip'],key,info[key]['vendor']);});
	var s = sortIP(info);
	for(var i=0;i<s.length;i++){
		t += line(s[i].hostname,s[i].ip,s[i].mac,s[i].vendor);
	}
	t += '</table>';
	return t;
}

// creates the page
module.exports = function(info){
	var page = '<!DOCTYPE html><html>';
	page += '<head>';

	page += '<style>';
	page += 'table.center { margin-left:auto; margin-right:auto;}';
// 	page += 'td.bold {font-weight: bold; text-align: right;}';
	page += 'h1.center {text-align: center;}';
	page += 'div.center {text-align: center;}';
	page += 'div.footer {position: fixed; bottom: 0; width: 100%; height: 44px; line-height: 44px; text-align: center; background-color: #888888;}';
	page += 'a {display: inline-block; margin: 0 40px; text-decoration: none; color: #ffffff; text-transform: uppercase; font-size: 12px;}';
	page += '</style>';
	page += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">';
	page += '</head>';
	page += '<body>';

	page += '<h1 class="center">'+ 'Network' +'</h1>'; 
	page += table(info); 

	page += '<div class="footer">';
	page += '<a href="https://github.com/walchko"> <i class="fa fa-github fa-lg"></i> Github</a> ';
// 	page += '<a id="timestamp">' + info['timestamp'] + '</a>';
	page += '</div>';
	page +='</body></html>';
	return page;
};