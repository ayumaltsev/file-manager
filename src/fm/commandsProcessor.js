import userCatalogInfo from "./userCatalogInfo.js";
import fileOperations from './fileOperations.js';
import os from 'os';

const args = process.argv.slice(2);
const space = ' ';
const operationErrorMessage = 'Operation failed';
const wrongArgumentsMessage = 'Invalid input';
const currentDirMessage = 'You are currently in ';
const promptMessage = 'Please, enter your command:';

const handleInput = async (chunk) => {
    const chunkStringified = chunk.toString();

    if (chunkStringified.includes('CLOSE')) process.exit(0);

    let commandWithArgs = chunkStringified.trim().split(space);
    const command = commandWithArgs[0].trim();
    const commandArgs = commandWithArgs.slice(1);

    try {
        if (command === 'up') {
            if (commandArgs.length > 0) {
                process.stdout.write(wrongArgumentsMessage + '\n');
                process.stdout.write('\n' + currentDirMessage + userCatalogInfo.getCurrentDir() + '\n' + promptMessage);
                return;
            }
            await fileOperations.up();
            process.stdout.write('\n' + currentDirMessage + userCatalogInfo.getCurrentDir() + '\n' + promptMessage);

        } else if (command === 'cd') {
            if (commandArgs.length !== 1) {
                process.stdout.write(wrongArgumentsMessage + '\n');
                process.stdout.write('\n' + currentDirMessage + userCatalogInfo.getCurrentDir() + '\n' + promptMessage);
                return;
            }
            await fileOperations.cd(commandArgs[0].trim());
            process.stdout.write('\n' + currentDirMessage + userCatalogInfo.getCurrentDir() + '\n' + promptMessage);

        } else if (command === 'ls') {
            if (commandArgs.length > 0) {
                process.stdout.write(wrongArgumentsMessage + '\n');
                process.stdout.write('\n' + currentDirMessage + userCatalogInfo.getCurrentDir() + '\n' + promptMessage);
                return;
            }

            const result = await fileOperations.ls();

            const forPrintingInTable = [];

            for (let dir of result.directories) {
                forPrintingInTable.push({Name: dir, Type: 'directory'});
            }

            for (let f of result.files) {
                forPrintingInTable.push({Name: f, Type: 'file'});
            }

            console.table(forPrintingInTable);

            process.stdout.write('\n' + currentDirMessage + userCatalogInfo.getCurrentDir() + '\n' + promptMessage);

        } else if (command === 'cat') {
            if (commandArgs.length !== 1) {
                process.stdout.write(wrongArgumentsMessage + '\n');
                process.stdout.write('\n' + currentDirMessage + userCatalogInfo.getCurrentDir() + '\n' + promptMessage);
                return;
            }

            await fileOperations.cat(commandArgs[0].trim()).then(result => console.log(result));

            process.stdout.write('\n' + currentDirMessage + userCatalogInfo.getCurrentDir() + '\n' + promptMessage);

        } else if (command === 'hash') {
            if (commandArgs.length !== 1) {
                process.stdout.write(wrongArgumentsMessage + '\n');
                process.stdout.write('\n' + currentDirMessage + userCatalogInfo.getCurrentDir() + '\n' + promptMessage);
                return;
            }

            await fileOperations.hash(commandArgs[0].trim()).then(result => console.log(result));

            process.stdout.write('\n' + currentDirMessage + userCatalogInfo.getCurrentDir() + '\n' + promptMessage);

        } else if (command === 'compress') {
            if (commandArgs.length !== 2) {
                process.stdout.write(wrongArgumentsMessage + '\n');
                process.stdout.write('\n' + currentDirMessage + userCatalogInfo.getCurrentDir() + '\n' + promptMessage);
                return;
            }

            await fileOperations.compress(commandArgs[0].trim(), commandArgs[1].trim()).then(() => console.log("Successfully compressed"));

            process.stdout.write('\n' + currentDirMessage + userCatalogInfo.getCurrentDir() + '\n' + promptMessage);

        } else if (command === 'os') {
            if (commandArgs.length !== 1 || !commandArgs[0].trim().startsWith('--')) {
                process.stdout.write(wrongArgumentsMessage + '\n');
                process.stdout.write('\n' + currentDirMessage + userCatalogInfo.getCurrentDir() + '\n' + promptMessage);
                return;
            }

            const argument = commandArgs[0].trim();

            switch (argument) {
                case "--EOL":
                    //console.log(`System EOL: "${os.EOL}"`);
                    console.log(`EOL in your system (${process.platform}) have ASCII codes: ${os.EOL.split('').map(c => c.charCodeAt(0))}`);
                    break;
                case "--cpus":
                    const cpus = os.cpus();
                    console.log(`Total CPUs: ${cpus.length}`);
                    cpus.forEach((cpu, index) => {
                        console.log(`CPU ${index + 1}: Model - ${cpu.model}, Speed - ${cpu.speed / 1000} GHz`);
                    });
                    break;
                case "--homedir":
                    console.log(`Home Directory: ${os.homedir()}`);
                    break;
                case "--username":
                    console.log(`Current User: ${os.userInfo().username}`);
                    break;
                case "--architecture":
                    console.log(`Node.js was compiled for: ${process.arch}`);
                    break;
                default:
                    process.stdout.write(wrongArgumentsMessage + '\n');
            }

            process.stdout.write('\n' + currentDirMessage + userCatalogInfo.getCurrentDir() + '\n' + promptMessage);

        } else {
            process.stdout.write(wrongArgumentsMessage + '\n');
            process.stdout.write(+'\n' + currentDirMessage + userCatalogInfo.getCurrentDir() + '\n' + promptMessage);
        }

    } catch (error) {
        process.stdout.write(operationErrorMessage + '\n');
        process.stdout.write('\n' + currentDirMessage + userCatalogInfo.getCurrentDir() + '\n' + promptMessage);
    }

};

process.stdin.on('data', handleInput);