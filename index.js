var TelegramBot = require('node-telegram-bot-api');
var irc = require('irc');

require('util').inherits(ServerLogger, require('events').EventEmitter);

function ServerLogger(options) {
    this.colors = {
        'white':    ['\x1B[37m', '\x1B[39m'],
        'gray':     ['\x1B[90m', '\x1B[39m'],
        'grey':     ['\x1B[90m', '\x1B[39m'],
        'black':    ['\x1B[30m', '\x1B[39m'],
        'blue':     ['\x1B[34m', '\x1B[39m'],
        'cyan':     ['\x1B[36m', '\x1B[39m'],
        'green':    ['\x1B[32m', '\x1B[39m'],
        'magenta':  ['\x1B[35m', '\x1B[39m'],
        'red':      ['\x1B[31m', '\x1B[39m'],
        'yellow':   ['\x1B[33m', '\x1B[39m']
    };

    this.logs = {};
    this.channelOptions = {};

    this.options = options || {};

    var defaultOptions = {
        'enableLogs': true,
        'defaultFolderLogs': "",
        'customLogsEvent': false,
        'dateOnLogs': false,

        'telegram': {
            'enable': false,
            'token': ''
        },

		'irc': {
			'enable': false,
			'server': null,
			'nick': null,
            'password': null
		}
    };

    for (var i in defaultOptions) {
        if(!defaultOptions.hasOwnProperty(i))
            continue;

        if(typeof this.options[i] === 'undefined')
            this.options[i] = defaultOptions[i];
    };

    if(this.options.telegram.enable)
        this.telegramStream = new TelegramBot(this.options.telegram.token, {polling: true});

    if(this.options.irc.enable)
    {
        this.ircStream = new irc.Client(this.options.irc.server, this.options.irc.nick, { 
            password: this.options.irc.password
        });
        
        this.ircStream.addListener('error', function(message) {
            console.log('error: ', message);
        });
    }
}

ServerLogger.prototype._send = function(channel, msg) {

    console.log(this._formatMsgConsole(channel, msg));

    if(this.options.telegram.enable && channel.telegram.stream)
        this.telegramStream.sendMessage(channel.telegram.chatid, this._formatMsgFile(channel, msg));
	
	if(this.options.irc.enable && channel.irc.stream)
    {
        this.ircStream.join(channel.irc.channel+' '+(channel.irc.password == null ? '' : channel.irc.password));
		this.ircStream.say(channel.irc.channel+' '+(channel.irc.password == null ? '' : channel.irc.password), this._formatMsgFile(channel, msg));
    }

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
                'telegram': {
                    'stream': false,
                    'chatid': 0
                },
				'irc': {
					'stream': false,
					'channel': '#channelnull',
					'password': null
				}
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
        'telegram': {
            'stream': false,
            'chat_id': 0
        },
		'irc': {
			'stream': false,
			'channel': '#channelnull',
			'password': null
		}
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
		date = "[ "+new Date().toISOString().replace(/T/, '').replace(/\..+/, '')+" ] ";

	return date+channel.name+": "+msg+"\n";
}

module.exports = ServerLogger;
