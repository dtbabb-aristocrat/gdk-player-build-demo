import * as fs from 'fs';
import * as got from 'got';
import * as path from 'path';
import * as shell from 'shelljs';
import * as unzip from 'unzip';
import * as winston from 'winston';

let archives = {
    poco: "https://pocoproject.org/releases/poco-1.9.0/poco-1.9.0.zip"
};

let paths = {
    projectRoot: 'C:\\Users\\d\\Aristocrat\\Lonestar\\gdk-player',
    systemRoot: "sysroot",
    thirdParty: "third-party",
    poco: ""
};

paths.systemRoot = paths.projectRoot + path.sep + paths.systemRoot + path.sep + 'Windows' + path.sep + 'x86_64' + path.sep + 'Debug';
paths.thirdParty = paths.projectRoot + path.sep + paths.thirdParty;
paths.poco = paths.thirdParty + path.sep + path.basename(archives.poco, '.zip');

if (!shell.test('-e', paths.systemRoot)) {
    winston.info(`Creating system root directory at ${paths.systemRoot}`);
    shell.mkdir('-p', paths.systemRoot);
} else {
    winston.info(`Using system root directory at ${paths.systemRoot}`);
}

winston.info(`Installing POCO to ${paths.systemRoot}`);
shell.mkdir('-p', paths.systemRoot);

let archivePath = paths.thirdParty + path.sep + path.basename(archives.poco);
if (!shell.test('-e', archivePath)) {
    winston.info(`Downloading archive ${archives.poco} to ${archivePath}`);
    got.stream(archives.poco).pipe(fs.createWriteStream(archivePath));
} else {
    winston.info(`Using archive ${archivePath}`);
}

// if (shell.test('-e', paths.poco)) {
//     winston.info(`Removing existing source directory ${paths.poco}`);
//     shell.rm('-fr', paths.poco);
// }

// TODO wait for the following async process to complete
// if (!shell.test('-e', paths.poco)) {
//     winston.info(`Extracting archive ${archivePath}`);
//     fs.createReadStream(archivePath).pipe(unzip.Extract({path: paths.thirdParty}));
// }

let buildDir = paths.poco + path.sep + "cmake-debug-build";

if (shell.test('-e', buildDir)) {
    winston.info(`Removing exists build directory ${buildDir}`);
    shell.rm('-fr', buildDir);
}

if (!shell.test('-e', buildDir)) {
    winston.info(`Creating build directory ${buildDir}`);
    shell.mkdir('-p', buildDir);
}

shell.cd(buildDir);

// TODO As a workaround, the environment is currently set from the outer shell. The following does not persist across commands.
// let envSetupCmd = '@call "C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Professional\\Common7\\Tools\\VsDevCmd.bat"';
// winston.info(`Configuring environment: ${envSetupCmd}`);
// shell.exec(envSetupCmd);

let cmakeCmd = `cmake ${paths.poco} -DCMAKE_INSTALL_PREFIX=${paths.systemRoot} -DCMAKE_GENERATOR_PLATFORM=x64`;
winston.info(`Configuring build: ${cmakeCmd}`);
shell.exec(cmakeCmd);

let buildCmd = 'devenv /build Debug Poco.sln';
winston.info(`Building: ${buildCmd}`);
shell.exec(buildCmd);

let installCmd = 'devenv /deploy Debug Poco.sln';
winston.info(`Installing: ${installCmd}`);
shell.exec(installCmd);






