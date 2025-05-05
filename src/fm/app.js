import userCatalogInfo from './userCatalogInfo.js';
import {spawn} from 'child_process';
import path from 'path';

const byMessage = 'Thank you for using File Manager, Username, goodbye!';
let userName = 'noname';

const parseArgs = () => {

    const args = process.argv.slice(2);
    const welcomeMessage = 'Welcome to the File Manager, Username!';
    const errorMessage = 'Please, start the application with only one argument called username!\n'
        + 'Example: npm run start -- --username=your_username';

    try {
        if (args.length > 1 || args.length === 0) {
            throw new Error();
        }

        const firstArg = args[0].trim().slice(2);
        const spitedNameValue = firstArg.split('=');
        if (spitedNameValue[0].trim() === 'username') {
            userName = spitedNameValue[1].trim();
        } else {
            throw new Error();
        }

    } catch (error) {
        console.error(errorMessage);
        process.exit(1);
    }

    console.log(welcomeMessage.replace('Username', userName));
    return userName;
};

const spawnChildProcess = async (args) => {

    const pathToProcessor = path.join(userCatalogInfo.__dirname, 'commandsProcessor.js');
    const child = spawn('node', [pathToProcessor, ...args], {stdio: ['pipe', 'pipe', 'inherit']});

    process.stdin.pipe(child.stdin);

    child.stdout.on('data', (data) => {
        console.log(`${data}`);
    });

    child.on('close', (code) => {
        let mess = byMessage.replace('Username', userName)
        console.log(mess);
    });

};

console.clear();
userName = parseArgs();
userCatalogInfo.printCurrentDir();
console.log('Please, enter your command:');
process.on('SIGINT', () => {
    let mess = byMessage.replace('Username', userName)
    console.log(mess);
    process.exit(0);
});

await spawnChildProcess('START');



