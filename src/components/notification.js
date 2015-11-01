var settings = require('./settings');

module.exports = {
    /**
     * Inject a callback in the onclick event.
     */
    inject: function (targetWindow, win) {
        var NativeNotification = targetWindow.Notification;

        targetWindow.Notification = function (title, options) {
            var defaultOnClick = options.onclick;
            delete options.onclick;
            if(settings.hideNotificationBody){
                options.body = 'Content hidden.'
            }
            var notif = new NativeNotification(title, options);
            notif.addEventListener('click', function () {
                win.show();
                win.focus();

                if (defaultOnClick) {
                    defaultOnClick();
                }
            });

            return notif;
        };

        targetWindow.Notification.prototype = NativeNotification.prototype;
        targetWindow.Notification.permission = NativeNotification.permission;
        targetWindow.Notification.requestPermission = NativeNotification.requestPermission.bind(targetWindow.Notification);
    }
};
