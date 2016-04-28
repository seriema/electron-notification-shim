'use strict';

// Electron doesn't support notifications in Windows yet. https://github.com/atom/electron/issues/262
// So we hijack the Notification API.'
const ipc = require('ipc');

module.exports = () => {
	const OldNotification = Notification;

	var settings = {
		forceSilent: false,
		bodyOverride: undefined
	};

	Notification = function (title, options) {
		// Send this to main thread.
		// Catch it in your main 'app' instance with `ipc.on`.
		// Then send it back to the view, if you want, with `event.returnValue` or `event.sender.send()`.
		ipc.send('notification-shim', {
			title,
			options
		});

		// Shim onclick event
		var notification;
		setTimeout(function () {
			var onclickOld = notification.onclick;
			notification.onclick = function () {
				ipc.send('notification-onclick-shim', notification);
				if (onclickOld) onclickOld();
			};
		}, 1);

		// Apply overrides
		options = Object.assign({}, options);
		if (settings.forceSilent) options.silent = true;
		if (settings.bodyOverride) options.body = settings.bodyOverride;

		// Send the native Notification.
		// You can't catch it, that's why we're doing all of this. :)
		return notification = new OldNotification(title, options);
	};

	Notification.prototype = OldNotification.prototype;
	Notification.permission = OldNotification.permission;
	Notification.requestPermission = OldNotification.requestPermission;

	return settings;
};
