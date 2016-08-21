# electron-notification-shim [![Build Status](https://travis-ci.org/seriema/electron-notification-shim.svg?branch=master)](https://travis-ci.org/seriema/electron-notification-shim)

> Get Notification API events in Electron main-process. Perfect for adding Notification toasters in Windows with node-notifier or other solution.

## Install

```
$ npm install --save electron-notification-shim
```

## Usage

Include it in your rendering-view like this:

    require('electron-notification-shim')();

That's all. Now you'll receive `notification-shim` events in your main-process, like this:

    ipcMain.on('notification-shim', (e, msg) => { ... });

The `msg` is a simple object: `{ title, options }`, which matches the two parameters sent to [new Notification(title, options)](https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification). You can send an event back with [e.returnValue](http://electron.atom.io/docs/v0.37.8/api/ipc-main/#eventreturnvalue) or [e.sender.send()](http://electron.atom.io/docs/v0.37.8/api/ipc-main/#eventsender) if you want to react to it in the rendering view as well.

### Options

You can send an `options` object when you initialize: `require('electron-notification-shim')(options);`.

#### `onclick`

A method for overriding the original `Notification.onclick`. Allows you to add a custom click handler instead of what was attached by the original notification sender. E.g. 

### Example code

#### Demos

Check the [electron-notification-shim-demos](https://github.com/seriema/electron-notification-shim-demos) page for different uses.

#### Sample

```js
// Main process, main.js
'use strict';
const path = require('path');
const app = require('app');
const ipcMain = require('electron').ipcMain;
const BrowserWindow = require('browser-window');

app.on('ready', () => {
	const win = new BrowserWindow({
		webPreferences: {
			// Load `electron-notification-shim` in rendering view.
			preload: path.join(__dirname, 'browser.js')
		}
	});

	// Listen for notification events.
	ipcMain.on('notification-shim', (e, msg) => {
		console.log(`Title: ${msg.title}, Body: ${msg.options.body}`);
	});

	// Just to test. Don't do this at home, kids. :)
	win.loadURL(`https://google.com`);
	win.webContents.on('did-finish-load', () => {
		win.webContents.executeJavaScript('new Notification("Hello!", {body: "Notification world!"})');
	});
});
```

```js
// Renderer process, browser.js
require('electron-notification-shim')();
```
