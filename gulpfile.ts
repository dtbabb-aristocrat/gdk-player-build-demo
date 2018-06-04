import * as gulp from 'gulp';
import * as path from 'path';
import * as shell from 'shelljs';
import * as winston from 'winston';

let paths = {
    sysroot: ""
};

let defaultTasks = [
    'Configure',
    'MakeSystemRootDirectory',
    'InstallPOCO'
];

gulp.task('Configure', function () {
  paths.sysroot = __dirname + 'sysroot' + path.sep + 'Windows' + path.sep + 'x86_64' + path.sep + 'Debug';
});

gulp.task('Clean', ['Configure'], function() {
    return shell.rm('-rf', paths.sysroot);
});

gulp.task('MakeSystemRootDirectory', function () {
    if (!shell.test('-e', paths.sysroot)) {
        winston.info(`Creating system root directory at ${paths.sysroot}`);
        shell.mkdir('-p', paths.sysroot);
    } else {
        winston.info(`Using system root directory at ${paths.sysroot}`);
    }
});

gulp.task('InstallPOCO', function () {
    winston.info(`Installing POCO to ${paths.sysroot}`);
    shell.mkdir('-p', paths.sysroot);
});

gulp.task('default', gulp.series(defaultTasks));