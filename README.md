# Sup for WhatsApp

Forked from [Aluxian's Repo](https://github.com/Aluxian/WhatsApp-Desktop) then reworked with some additional features and major fixes.


A Native desktop wrapper for WhatsApp which runs mainly on Windows. Built with [NW.js](http://nwjs.io/). OSX and Linux builds need help as I'm having trouble compiling on Windows! Get the latest [release](https://github.com/zweicoder/Sup-for-WhatsApp/releases)!

This is a hobby project I'm working on mainly because I found it very troublesome to cycle to the Web WhatsApp tab (and back) frequently. I also wanted some additional features lacking in WebWhatsApp like hotkeys.

####This is **NOT** affiliated with WhatsApp or Facebook. This is **NOT** an official product. Read the [DISCLAIMER](https://github.com/zweicoder/Sup-for-WhatsApp/blob/master/DISCLAIMER).

![Cross-platform screenshot](screenshot.png)

## Features

* **Able to hide notification body (Right click in the app and check the option)**
* **Able to cycle through conversations through (Shift) Tab**
* More convenient to cycle through native windows as compared to cycling through tabs in your browser
* All features of Web WhatsApp (since this is a wrapper around it)
* Preferences in the right-click context menu (or menu bar for OS X, tray menu for Windows)
* **Any ideas or requests? submit an issue!**

## Build

### Pre-requisites

    # install gulp
    npm install -g gulp

    # install dependencies
    npm install

* **wine**: If you're on OS X/Linux and want to build for Windows, you need [Wine](http://winehq.org/) installed. Wine is required in order
to set the correct icon for the exe. If you don't have Wine, you can comment out the `winIco` field in `gulpfile`.
* **makensis**: Required by the `pack:win32` task in `gulpfile` to create the Windows installer.
* [**fpm**](https://github.com/jordansissel/fpm): Required by the `pack:linux{32|64}:deb` tasks in `gulpfile` to create the Linux installers.

Quick install on OS X:

    brew install wine makensis
    sudo gem install fpm

### OS X: pack the app in a .dmg (Needs help)

    gulp pack:osx64

### Windows: create the installer

    gulp pack:win32

### Linux 32/64-bit: pack the app in a .deb (Needs help)

    gulp pack:linux{32|64}:deb

The output is in `./dist`. Take a look at `gulpfile.js` for additional tasks.

## Note to WhatsApp

This project does not attempt to reverse engineer the WhatsApp API or attempt to reimplement any part of the WhatsApp client. Any communication between the user and WhatsApp servers is handled by WhatsApp Web itself; this is just a native wrapper for WhatsApp Web, more akin to a browser than any WhatsApp software.

## Contributions

Contributions are welcome! For feature requests and bug reports please [submit an issue](https://github.com/zweicoder/WhatsApp-Desktop/issues).

## License

The MIT License (MIT)

Copyright (c) 2015 Authors of this source code

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
