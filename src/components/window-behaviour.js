var gui = window.require('nw.gui');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var platform = require('./platform');
var settings = require('./settings');

module.exports = {
    /**
     * Update the behaviour of the given window object.
     */
    set: function (win) {
        // Show the window when the dock icon is pressed
        gui.App.removeAllListeners('reopen');
        gui.App.on('reopen', function () {
            win.show();
            //this.restoreWindowState()
        });

        win.on('close', function () {
            this.saveWindowState(win);
            windowBehaviour.deleteFileCache();
            win.close(true);

        }.bind(this));
    },
    /**
     * Clicks on the chat before/after the active one with  Shift + Tab / Tab
     */
    enableSwitchWithTabKey: function (doc) {
        doc.onkeydown = function (e) {
            if (e.keyCode == 9 && !e.repeat) {
                e.preventDefault();
                var delta = e.shiftKey ? 1 : -1;
                var activeChat = doc.querySelector('.active');
                var items = doc.getElementsByClassName('infinite-list-item');
                if (activeChat) {
                    var idx = parseInt(getZIndex(activeChat)) + delta;
                    // ignore if cannot find cause probably out of bounds like top of the chat list
                    //console.log("Wanted: " + idx);
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].style.zIndex == idx) {
                            //console.log("Click on ",items[i].childNodes[0]);
                            items[i].childNodes[0].childNodes[0].click();
                            return false;
                        }
                    }
                } else {
                    var lastMax = 0;
                    var idx = -1;
                    for (var i = 0; i < items.length; i++) {
                        var zIndex = items[i].style.zIndex;
                        if (zIndex > lastMax) {
                            //console.log("Click on ",items[i].childNodes[0]);
                            lastMax = zIndex;
                            idx = i;
                        }
                    }
                    items[idx].childNodes[0].childNodes[0].click();
                    return false;
                }
            }
        }
    },

    /**
     * Change the new window policy to open links in the browser or another window.
     */
    setNewWinPolicy: function (win) {
        win.removeAllListeners('new-win-policy');
        win.on('new-win-policy', function (frame, url, policy) {
            if (settings.openLinksInBrowser) {
                gui.Shell.openExternal(url);
                policy.ignore();
            } else {
                policy.forceNewWindow();
            }
        });
    },

    /**
     * Listen for window state events.
     */
    bindWindowStateEvents: function (win) {
        win.removeAllListeners('maximize');
        win.on('maximize', function () {
            win.sizeMode = 'maximized';
        });

        win.removeAllListeners('unmaximize');
        win.on('unmaximize', function () {
            win.sizeMode = 'normal';
        });

        win.removeAllListeners('minimize');
        win.on('minimize', function () {
            win.sizeMode = 'minimized';
        });

        win.removeAllListeners('restore');
        win.on('restore', function () {
            win.sizeMode = 'normal';
        });
    },

    /**
     * Bind the events of the node window to the content window.
     */
    bindEvents: function (win, contentWindow) {
        ['focus', 'blur'].forEach(function (name) {
            win.removeAllListeners(name);
            win.on(name, function () {
                if (contentWindow.dispatchEvent && contentWindow.Event) {
                    contentWindow.dispatchEvent(new contentWindow.Event(name));
                }
            });
        });
    },

    /**
     * Set an interval to sync the badge and the title.
     */
    syncBadgeAndTitle: function (win, parentDoc, childDoc) {
        var notifCountRegex = /\((\d)\)/;

        setInterval(function () {
            // Sync title
            parentDoc.title = childDoc.title;

            // Find count
            var countMatch = notifCountRegex.exec(childDoc.title);
            var label = countMatch && countMatch[1] || '';
            win.setBadgeLabel(label);

            // Update the tray icon too
            if (win.tray) {
                var type = platform.isOSX ? 'menubar' : 'tray';
                var alert = label ? '_alert' : '';
                var extension = platform.isOSX ? '.tiff' : '.png';
                win.tray.icon = 'images/icon_' + type + alert + extension;
            }
        }, 100);
    },

    /**
     * Store the window state.
     */
    saveWindowState: function (win) {
        var state = {
            mode: win.sizeMode || 'normal'
        };

        if (state.mode == 'normal') {
            state.x = win.x;
            state.y = win.y;
            state.width = win.width;
            state.height = win.height;
        }

        settings.windowState = state;
    },

    /**
     * Restore the window size and position.
     */
    restoreWindowState: function (win) {
        var state = settings.windowState;
        if (state.mode == 'maximized') {
            win.maximize();
        } else {
            win.resizeTo(state.width, state.height);
            win.moveTo(state.x, state.y);
        }

        win.show();
    },

    /**
     * Delete folder cache after close application
     */
    deleteFileCache: function () {
        var pathFileCache = path.join(gui.App.dataPath, 'Application Cache');
        rimraf(pathFileCache, function (err) {
            console.log(err);
        });
    }
};

var getZIndex = function (ele) {
    return ele.style.zIndex || getZIndex(ele.parentNode);
};