var ServerLogger = require('../index.js');

var logger = new ServerLogger({
	"enableLogs": false,

	"enableStreamTelegram": true,
	"telegram_token": ''
});

logger.channelAdd({
	"name": 'error',
	"level": 1,
	"color": logger.colors.red
});

logger.channelAdd({
	"name": 'info',
	"level": 2,
	"color": logger.colors.green,
	"telegramStream": true,
	"telegramChat_id": ""
});

logger.logs.error("Error testing");
logger.logs.info("Info testing");

