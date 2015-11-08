# electron-notification-shim
> Get Notification API events in Electron main-process. Perfect for adding Notification toasters in Windows with node-notifier or other solution.

## Usage

Include it in your renderering-view like this:

    require('electron-notification-shim')();

That's all. Now you'll receive `notification-shim` events in your main-process, like this:

    ipc.on('notification-shim', (e, msg) => { ... });

The `msg` is a simple object: `{ title, options }`, which matches the two parameters sent to [new Notification(title, options)](https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification). You can send an event back with [e.returnValue](http://electron.atom.io/docs/v0.34.0/api/ipc-main-process/#event-returnvalue) or [e.sender.send()](http://electron.atom.io/docs/v0.34.0/api/ipc-main-process/#event-sender-send-channel-arg1-arg2) if you want to react to it in the rendering view as well.

### Example code

#### Demos

Check the [electron-notification-shim-demos](https://github.com/seriema/electron-notification-shim-demos) page for different uses.

#### Sample

```js
// Main process, main.js
'use strict';
const app = require('app');
const ipc = require('ipc');
const path = require('path');
const BrowserWindow = require('browser-window');

app.on('ready', () => {
	const win = new BrowserWindow({
		'web-preferences': {
			// Load `electron-notification-shim` in rendering view, by requiring it in your preloaded script.
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
```

```js
// Renderer process, browser.js
require('electron-notification-shim')();
```
