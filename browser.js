// Include the shim. Note: Your code should use `require('electron-notification-shim')();`.
require('./.')();


var notification = new Notification('The title', {
	body: 'The body.'
});
