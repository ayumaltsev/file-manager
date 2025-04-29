import os from 'os';

const currentDirMessage = 'You are currently in ';
const homeDir = os.homedir();
process.chdir(homeDir);

function printHomeDir() {
    console.log(homeDir);
}

let currentDir;

function getCurrentDir() {
    return currentDir;
}

function setCurrentDir(newDir) {
    process.chdir(newDir);
    currentDir = process.cwd();
    if (currentDir !== newDir) {
        throw new Error('Operation failed');
    }
}

function printCurrentDir() {
    console.log(currentDirMessage + currentDir);
}

setCurrentDir(homeDir);

export default {homeDir, printHomeDir, getCurrentDir, setCurrentDir, printCurrentDir};

