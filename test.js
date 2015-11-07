// Main process
'use strict';
const app = require('app');
const ipc = require('ipc');
const path = require('path');
const BrowserWindow = require('browser-window');

app.on('ready', () => {
	const win = new BrowserWindow({
		'web-preferences': {
			// Load `electron-notification-shim` in rendering view.
			preload: path.join(__dirname, 'browser.js')
		}
	});

	// Listen for notification events.
	ipc.on('notification-shim', (e, msg) => {
		console.log(`Title: ${msg.title}, Content: ${msg.options.content}`);
	});

	// Just to test. Don't do this at home, kids. :)
	win.loadUrl(`https://google.com`);
	win.webContents.on('did-finish-load', () => {
		win.webContents.executeJavaScript('new Notification("Hello!", {content: "Notification world!"})');
	});
});
