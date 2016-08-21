'use strict';

// Electron doesn't automatically show notifications in Windows yet, and it's not easy to polyfill.
// So we have to hijack the Notification API.
let ipc;
try {
	// Using electron >=0.35
	ipc = require('electron').ipcRenderer;
} catch (e) {
	// Assume it's electron <0.35
	ipc = require('ipc');
}

// Default settings
const defaultSettings = {
	onclick: null
};

module.exports = (overrideSettings) => {
	const OldNotification = Notification;
	const settings = Object.assign(defaultSettings, overrideSettings);

	Notification = function (title, options) {
		// Send this to main thread.
		// Catch it in your main 'app' instance with `ipc.on`.
		// Then send it back to the view, if you want, with `event.returnValue` or `event.sender.send()`.
		ipc.send('notification-shim', {
			title,
			options
		});

		// Send the native Notification.
		// You can't catch it, that's why we're doing all of this. :)
		let notification =  new OldNotification(title, options);
		if (settings.onclick) {
			notification.onclick = function (event) {
				settings.onclick(event);
				// TODO: ipc.send('notification-shim-onclick', event);
			};
		}
		return notification;
	};

	Notification.prototype = OldNotification.prototype;
	Notification.permission = OldNotification.permission;
	Notification.requestPermission = OldNotification.requestPermission;
};
