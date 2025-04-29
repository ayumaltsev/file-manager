import userCatalogInfo from './userCatalogInfo.js';

const wrongArguments = 'Invalid input';

const parseArgs = () => {

    const args = process.argv.slice(2);
    const welcomeMessage = 'Welcome to the File Manager, Username!';
    const errorMessage = 'Please, start the application with only one argument called username!\n'
        + 'Example: npm run start -- --username=your_username';
    let userName = 'noname';

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

parseArgs();
userCatalogInfo.printCurrentDir();




