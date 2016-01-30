var plugins, fs, gulp, manifest, mergeStream, runSequence, shelljs;
gulp = require('gulp');
shelljs = require('shelljs');
mergeStream = require('merge-stream');
runSequence = require('run-sequence');
manifest = require('./package.json');
plugins = require('gulp-load-plugins')();
fs = require('fs');
var strformat = require('strformat');
var semver = require('semver');
var zip = require('gulp-zip');

gulp.task('clean', function () {
    shelljs.rm('-rf', './build');
    return shelljs.rm('-rf', './dist');
});

['win32', 'osx64', 'linux32', 'linux64'].forEach(function (platform) {
    return gulp.task('build:' + platform, function () {
        if (process.argv.indexOf('--toolbar') > 0) {
            shelljs.sed('-i', '"toolbar": false', '"toolbar": true', './src/package.json');
        }
        return gulp.src('./src/**').pipe(plugins.nodeWebkitBuilder({
            platforms: [platform],
            version: '0.12.2',
            winIco: process.argv.indexOf('--noicon') > 0 ? void 0 : './assets-windows/icon.ico',
            macIcns: './assets-osx/icon.icns',
            macZip: true,
            macPlist: {
                NSHumanReadableCopyright: 'aluxian.com',
                CFBundleIdentifier: 'com.zweicoder.supforwhatsapp'
            }
        })).on('end', function () {
            if (process.argv.indexOf('--toolbar') > 0) {
                return shelljs.sed('-i', '"toolbar": true', '"toolbar": false', './src/package.json');
            }
        });
    });
});

gulp.task('sign:osx64', ['build:osx64'], function () {
    shelljs.exec('codesign -v -f -s "Alexandru Rosianu Apps" ./build/supforwhatsapp/osx64/supforwhatsapp.app/Contents/Frameworks/*');
    shelljs.exec('codesign -v -f -s "Alexandru Rosianu Apps" ./build/supforwhatsapp/osx64/supforwhatsapp.app');
    shelljs.exec('codesign -v --display ./build/supforwhatsapp/osx64/supforwhatsapp.app');
    return shelljs.exec('codesign -v --verify ./build/supforwhatsapp/osx64/supforwhatsapp.app');
});

gulp.task('pack:osx64', ['sign:osx64'], function () {
    shelljs.mkdir('-p', './dist');
    shelljs.rm('-f', './dist/supforwhatsapp-Mac.zip');
    return gulp.src('./build/supforwhatsapp/osx64/**')
			.pipe(zip('supforwhatsapp-Mac.zip'))
			.pipe(gulp.dest('./dist'));
});

gulp.task('pack:win32', ['build:win32'], function () {
    return shelljs.exec('makensis ./assets-windows/installer.nsi');
});

[32, 64].forEach(function (arch) {
    return ['deb', 'rpm'].forEach(function (target) {
        return gulp.task("pack:linux" + arch + ":" + target, ['build:linux' + arch], function () {
            var move_opt, move_png256, move_png48, move_svg;
            shelljs.rm('-rf', './build/linux');
            move_opt = gulp.src(['./assets-linux/supforwhatsapp.desktop', './assets-linux/after-install.sh', './assets-linux/after-remove.sh', './build/supforwhatsapp/linux' + arch + '/**']).pipe(gulp.dest('./build/linux/opt/supforwhatsapp'));
            move_png48 = gulp.src('./assets-linux/icons/48/whatsappfordesktop.png').pipe(gulp.dest('./build/linux/usr/share/icons/hicolor/48x48/apps'));
            move_png256 = gulp.src('./assets-linux/icons/256/whatsappfordesktop.png').pipe(gulp.dest('./build/linux/usr/share/icons/hicolor/256x256/apps'));
            move_svg = gulp.src('./assets-linux/icons/scalable/whatsappfordesktop.png').pipe(gulp.dest('./build/linux/usr/share/icons/hicolor/scalable/apps'));
            return mergeStream(move_opt, move_png48, move_png256, move_svg).on('end', function () {
                var output, port;
                shelljs.cd('./build/linux');
                port = arch === 32 ? 'i386' : 'amd64';
                output = "../../dist/supforwhatsapp_linux" + arch + "." + target;
                shelljs.mkdir('-p', '../../dist');
                shelljs.rm('-f', output);
                shelljs.exec("fpm -s dir -t " + target + " -a " + port + " -n supforwhatsapp --after-install ./opt/supforwhatsapp/after-install.sh --after-remove ./opt/supforwhatsapp/after-remove.sh --license MIT --category Chat --description \"A simple and beautiful app for Facebook WhatsApp. Chat without distractions on any OS. Not an official client.\" -m \"zweicoder<zweicoder@github.com>\" -p " + output + " -v " + manifest.version + " .");
                return shelljs.cd('../..');
            });
        });
    });
});

gulp.task('pack:all', function (callback) {
    return runSequence('pack:osx64', 'pack:win32', 'pack:linux32:deb', 'pack:linux64:deb', callback);
});

gulp.task('run:osx64', ['build:osx64'], function () {
    return shelljs.exec('open ./build/supforwhatsapp/osx64/supforwhatsapp.app');
});

gulp.task('open:osx64', function () {
    return shelljs.exec('open ./build/supforwhatsapp/osx64/supforwhatsapp.app');
});

gulp.task('release', ['pack:all'], function (callback) {
    return gulp.src('./dist/*')
        .pipe(plugins.githubRelease({
            token: process.env.GITHUB_TOKEN,
            draft: true,
            manifest: manifest
        }));
});

gulp.task('default', ['pack:all']);

gulp.task('bump', function () {
    if (process.argv[3] == null) {
        console.log("Usage: gulp bump --[major | minor | patch ]");
        return;
    }
    var newVer,
        bumpType = process.argv[3].toLowerCase().replace("--", "");
    if (['major', 'minor', 'patch', 'version'].indexOf(bumpType) > 0) {
        console.log("Usage: gulp bump --[major | minor | patch ]");
        return;
    }
    var pkg = JSON.parse(fs.readFileSync('./src/package.json', 'utf8'));
    newVer = semver.inc(pkg.version, bumpType);
    var urlPath = strformat("https://github.com/zweicoder/Sup-for-WhatsApp/releases/download/{version}/", {version: newVer});
    return gulp.src('./src/package.json')
        .pipe(plugins.jsonEditor({
            "version": newVer,
            "packages": {
                "osx64": urlPath + 'supforwhatsapp.dmg',
                "win32": urlPath + 'supforwhatsapp.exe',
                "linux32": urlPath + 'supforwhatsapp_32.deb',
                "linux64": urlPath + 'supforwhatsapp_64.deb'
            }
        }))
        .pipe(gulp.dest('./src/'));
});
