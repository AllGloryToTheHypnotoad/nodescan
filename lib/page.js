// Create an HTML5 webpage 

// use font awesome to update host status
function status(s){
	if(s === 'up') return '<i class="fa fa-check"></i>';
	else return '<i class="fa fa-remove"></i>';
}

// Build each row of the table
function line(a,b,c,d){
// 	return '<tr><td>' + a + '</td><td>' + b + '</td><td>' + c + '</td><td>' + d + '</td><td><a>TCP</a></td></tr>';
	return '<tr><td>' + a + '</td><td>' + b + '</td><td>' + c + '</td><td>' + d + '</td></tr>';
}


// build the table of network info
// input: info (a list of hosts sorted by ip addr)
// output: html table
function table(info){
	// if nothing yet ... tell user still scanning network
	if (info.length === 0) return '<p class="center"> Still scanning network </p>';
	
	// ok, found something, so put it in a table
	var t = '<table class="pure-table pure-table-striped center">';
	for(var i=0;i<info.length;i++){
		t += line(info[i].hostname,info[i].ip,info[i].mac,info[i].vendor);
	}
	t += '</table>';
	return t;
}

// creates the page
// input: info (list of hosts sorted by ip addr)
module.exports = function(info){
	var page = '<!DOCTYPE html><html>';
	page += '<head>';

	page += '<style>';
	page += 'table.center { margin-left:auto; margin-right:auto;}';
// 	page += 'td.bold {font-weight: bold; text-align: right;}';
	page += 'h1.center {text-align: center;}';
	page += 'p.center {text-align: center;}';
// 	page += 'div.center {text-align: center;}';
// 	page += 'div.footer {position: fixed; bottom: 0; width: 100%; height: 44px; line-height: 44px; text-align: center; background-color: #888888;}';
// 	page += 'a {display: inline-block; margin: 0 40px; text-decoration: none; color: #ffffff; text-transform: uppercase; font-size: 12px;}';
	page += '</style>';
	page += '<link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.6.0/pure-min.css">'
	page += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">';
	page += '</head>';
	page += '<body>';

	page += '<h1 class="center">'+ 'Network' +'</h1>'; 
	page += table(info); 

// 	page += '<div class="footer">';
// 	page += '<a href="https://github.com/walchko"> <i class="fa fa-github fa-lg"></i> Github</a> ';
// // 	page += '<a id="timestamp">' + info['timestamp'] + '</a>';
// 	page += '</div>';
	page +='</body></html>';
	return page;
};