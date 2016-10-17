# Server Logger for Node.js
[![npm version](https://img.shields.io/npm/v/server-logger.svg)](https://www.npmjs.com/package/server-logger)
[![npm downloads](https://img.shields.io/npm/dm/server-logger.svg)](https://npmjs.com/package/server-logger)
[![license](https://img.shields.io/npm/l/server-logger.svg)](https://github.com/lucasgolino/node-server-logger/blob/master/LICENSE)


This module provide an easy way to output console informations with custom tags and store on files.

# Installation

Install it from npm:
	
	$ npm install node-server-logger

# How to use
	
```js
var ServerLogger = require('node-server-logger');
var logger = new ServerLogger(options);

logger.channelAdd({
	"name": 'info',
	"level": 1,
	"color": logger.colors.green
});

logger.logs.info("Info testing");
```

## Init Options
- `enableLogs` - Enable output logs on files. default: `true`
- `defaultFolderLogs` - Folder to save logs. default: ` `
- `customLogsEvent` - Custom event when log is emit (see below). default: `false`
- `dateOnLogs` - Input the time of logs when append to file. default: `false`

- `telegram` - Telegram JSON Config
	- `enable` - Enable stream logs to telegram bot. default: `false`
	- `token` - Telegram BOT Token

## Events
- `logger` - called when `customLogsEvent` is set `true`.

```js
logger.on('logger', function(channel, msg) {
	----
});
```

- `channel` - is a object with channel infos
	- `name` - name of channel.
	- `level` - level of channel.
	- `logger` - if this channel have logs output to file.
	- `loggerFile` - name of file to store channel logs.
	- `color` - object with color (see below)
	- `telegram` - Telegram channel infos Object
		- `stream` - Enable telegram stream to channel.
		- `chatid` - Chat ID for stream to telegram.

## Colors

```js
logger.colors.white
logger.colors.gray
logger.colors.grey
logger.colors.black
logger.colors.blue
logger.colors.cyan
logger.colors.green
logger.colors.magenta
logger.colors.red
logger.colors.yellow
```
