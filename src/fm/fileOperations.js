import fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';

//after this module's importing we'll have home user directory as current working directory
import userCatalogInfo from './userCatalogInfo.js';

const operationErrorMessage = 'Operation failed';
const wrongArguments = 'Invalid input';

const isDestinationExists = async (destination) => {
    try {
        await fsPromises.access(destination);
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }
        throw new Error(operationErrorMessage);
    }
}

const getAbsolutePath = (filePath) => path.isAbsolute(filePath) ? filePath : path.resolve(filePath);

const isCorrectPath = async (destination) => {
    const normalizedDestination = path.normalize(destination);
    try {
        if (await isDestinationExists(normalizedDestination)) {
            const absoluteNormalizedHome = getAbsolutePath(path.normalize(userCatalogInfo.homeDir));
            const absoluteNormalizedDestination = getAbsolutePath(normalizedDestination);
            return absoluteNormalizedDestination.startsWith(absoluteNormalizedHome);
        } else {
            return false;
        }
    } catch (error) {
        throw new Error(operationErrorMessage);
    }
}

const isFile = async (destination) => {
    try {
        const stats = await fsPromises.stat(destination);
        return stats.isFile();
    } catch (error) {
        throw new Error(operationErrorMessage);
    }
};

const cat = async (pathToFile) => {
    if (await isCorrectPath(pathToFile)) {
        try {

            if (!await isFile(path.normalize(pathToFile))) {
                throw new Error(wrongArguments);
            }

            const readableStream = fs.createReadStream(pathToFile);
            readableStream.on('data', (chunk) => {
                process.stdout.write(chunk);
            });
            readableStream.on('end', () => {
            });
        } catch (error) {
            if (error.message === wrongArguments) {
                throw error;
            }
            throw new Error(operationErrorMessage);
        }
    } else {
        throw new Error(operationErrorMessage);
    }
};

let flag2 = await isCorrectPath('C:\\Users\\ayuma\\KINO\\rom\\whsfbfb.txt');
console.log(flag2);

try {
    await cat('./KINO/rom');
} catch (error) {
    console.error(error.message);
}



