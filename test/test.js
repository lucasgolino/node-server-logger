var ServerLogger = require('../index.js');

var logger = new ServerLogger({
	"enableLogs": false,

	"irc": {
		'enable': true,
		'server': 'irc.yourserver.net',
		'nick': 'bot_speak_a_lot',
		'channel': '#main'
	}
});

logger.channelAdd({
	"name": 'info',
	"level": 1,
	"color": logger.colors.red,
	'irc': {
		'stream': true,
		'channel': '#main',
		'password': null
	}
});

setTimeout(function() {
	logger.logs.info('HEY! I\' here');
}, 5000);

setTimeout(function() {
	logger.logs.info('a lot a lot a lot a lot........! alaways a lot!');
}, 10000);

