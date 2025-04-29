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

const add = async (pathToFile) => {

    const normalizedPath = path.normalize(pathToFile);
    const fileName = path.basename(path.normalize(normalizedPath));
    const directory = path.dirname(path.normalize(normalizedPath));

    if (!await isCorrectPath(directory) || await isDestinationExists(normalizedPath)) {
        throw new Error(operationErrorMessage);
    }

    await fsPromises.writeFile(path.join(directory, fileName), '');
}


const mkdir = async (folderPath) => {

    const normalizedPath = path.normalize(folderPath);
    const parentFolder = path.dirname(path.normalize(normalizedPath));

    if (!await isCorrectPath(parentFolder) || await isDestinationExists(normalizedPath)) {
        throw new Error(operationErrorMessage);
    }

    await fsPromises.mkdir(folderPath, {recursive: false});
}