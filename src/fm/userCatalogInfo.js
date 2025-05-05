import os from 'os';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
}

function printCurrentDir() {
    console.log(currentDirMessage + currentDir);
}

setCurrentDir(homeDir);

export default {homeDir, printHomeDir, getCurrentDir, setCurrentDir, printCurrentDir, __dirname};

