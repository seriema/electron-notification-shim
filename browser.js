// Include the shim. Note: Your code should use `require('electron-notification-shim')();`.
require('./.')();


var notification = new Notification('The title', {
	body: 'The body.'
});
notification.onclick = function () { // <<---- Here's a problem. The web app can override it's own notifications whenever it wants. How do we detect and redirect?
	alert('The original onclick.');
};
