// Main process
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
		console.log(`Title: ${msg.title}, Content: ${msg.options.content}`);
	});

	// Just to test. Don't do this at home, kids. :)
	win.loadURL(`https://google.com`);
	win.webContents.on('did-finish-load', () => {
		win.webContents.executeJavaScript('new Notification("Hello!", {content: "Notification world!"})');
	});
});
