// determine if running as root
var spawn = require('child_process');
var debug = require('debug')('kevin:is_sudo'); // debugging
/*
simple example:

is_sudo().then(function(response){
	if( response === false ) {
		console.log('Sorry, you have to have root privileges, use sudo or run as root');
		process.exit();
	}
});


output: bool (true - root/sudo, false - some other user)
*/
function is_sudo(){
	var ans = false;
	return new Promise(function(response,reject){
		spawn.exec('whoami', function (err, stdout, stderr){
			if (err) {
				console.log("is_sudo error: " +
					err.code + stderr);
			}
			var usr = stdout.replace('\n','');
			if(usr === 'root') ans = true;
			debug('user is: '+usr);
			response(ans);
		});
	});
}


module.exports = is_sudo;


