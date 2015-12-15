var ServerLogger = require('../index.js');

var logger = new ServerLogger({
	"enableLogs": true,
	"customLogsEvent": true,
	"dateOnLogs": true
});

logger.channelAdd({
	"name": 'error',
	"level": 1,
	"color": logger.colors.red
});

logger.channelAdd({
	"name": 'info',
	"level": 2,
	"color": logger.colors.green
});

logger.logs.error("Error testing");
logger.logs.info("Info testing");

