var TelegramBot = require('node-telegram-bot-api');

require('util').inherits(ServerLogger, require('events').EventEmitter);

function ServerLogger(options) {
	this.colors = {
		'white': 	['\x1B[37m', '\x1B[39m'],
		'gray': 	['\x1B[90m', '\x1B[39m'],
		'grey': 	['\x1B[90m', '\x1B[39m'],
		'black': 	['\x1B[30m', '\x1B[39m'],
		'blue': 	['\x1B[34m', '\x1B[39m'],
		'cyan': 	['\x1B[36m', '\x1B[39m'],
		'green': 	['\x1B[32m', '\x1B[39m'],
		'magenta': 	['\x1B[35m', '\x1B[39m'],
		'red': 		['\x1B[31m', '\x1B[39m'],
		'yellow': 	['\x1B[33m', '\x1B[39m']
	};

	this.logs = {};
	this.channelOptions = {};

	this.options = options || {};

	var defaultOptions = {
		"enableLogs": true,
		"defaultFolderLogs": "",
		"customLogsEvent": false,
		"dateOnLogs": false,

		"enableStreamTelegram": false,
		"telegram_token": ''
	};

	for (var i in defaultOptions) {
		if(!defaultOptions.hasOwnProperty(i))
			continue;

		if(typeof this.options[i] === 'undefined')
			this.options[i] = defaultOptions[i];
	};

	if(this.options.enableStreamTelegram)
		this.bot = new TelegramBot(this.options.telegram_token, {polling: true});
}


ServerLogger.prototype._send = function(channel, msg) {

	console.log(this._formatMsgConsole(channel, msg));

	if(this.options.enableStreamTelegram && channel.telegramStream)
		this.bot.sendMessage(channel.telegramChat_id, this._formatMsgFile(channel, msg));

	if(channel.logger && this.options.enableLogs)
		if(this.options.customLogsEvent == false)
			this._addLogs(channel.loggerFile, this._formatMsgFile(channel, msg));
		else
			this.emit('logger', channel, msg);
}

ServerLogger.prototype._addLogs = function(file, msg)
{
	var self = this;
	require('fs').appendFile(this.options.defaultFolderLogs + file, msg, function(err){
		if(err) {
			var internalError = {
				'name': 'internalError',
				'level': 0,
				'logger': false,
				'loggerFile': '',
				'color': self.colors.red,
				'telegramStream': false,
				'telegramChat_id': 0
			};

			self._send(internalError, err);
		}
	});
}

ServerLogger.prototype.channelAdd = function(options) {
	var self = this;

	var defaultOptions = {
		'name': 'info',
		'level': 1,
		'logger': true,
		'loggerFile': 'info.log',
		'color': this.colors.green,
		'telegramStream': false,
		'telegramChat_id': 0
	};

	options = options || {};

	for(var i in defaultOptions) {
		if(!defaultOptions.hasOwnProperty(i))
			continue;

		if(typeof options[i] === 'undefined')
			options[i] = defaultOptions[i];
	};
	
	this.channelOptions[options.level] = options;

	this.logs[options.name] = function(message) {
		self._send(options, message);
	}
}

ServerLogger.prototype._formatMsgConsole = function(channel, msg)
{
	return channel.color[0]+channel.name+channel.color[1]+": "+msg;
}

ServerLogger.prototype._formatMsgFile = function(channel, msg)
{
	var date = "";

	if(this.options.dateOnLogs)
		date = "[ "+new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')+" ] ";

	return date+channel.name+": "+msg+"\n";
}

module.exports = ServerLogger;