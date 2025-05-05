import fsPromises from 'fs/promises';
import path from 'path';
import fs from 'fs';

import userCatalogInfo from './userCatalogInfo.js';

const operationErrorMessage = 'Operation failed';
const wrongArgumentsMessage = 'Invalid input';

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

const up = async () => {
    try {
        const home = path.normalize(userCatalogInfo.homeDir);
        const current = path.normalize(userCatalogInfo.getCurrentDir());
        if (await isCorrectPath(current)) {
            if (current === home) return;
            userCatalogInfo.setCurrentDir(path.dirname(current));
        }
    } catch (error) {
        throw new Error(operationErrorMessage);
    }
}

const cd = async (newDirectory) => {
    try {
        newDirectory = path.normalize(newDirectory);
        if (await isCorrectPath(newDirectory)) {
            userCatalogInfo.setCurrentDir(newDirectory);
        } else {
            throw new Error(operationErrorMessage);
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

const ls = async () => {

    const currentDir = userCatalogInfo.getCurrentDir();
    const directories = [];
    const files = [];

    try {
        const elements = await fsPromises.readdir(currentDir);

        for (let element of elements) {
            if (await isFile(element)) {
                files.push(element);
            } else {
                directories.push(element);
            }
        }

        directories.sort();
        files.sort();

        return {directories, files};

    } catch (error) {
        throw new Error(operationErrorMessage);
    }
};

const cat = async (pathToFile) => {

    if (await isCorrectPath(pathToFile)) {
        try {

            if (!await isFile(path.normalize(pathToFile))) {
                throw new Error(wrongArgumentsMessage);
            }

            return new Promise((resolve, reject) => {
                let bufferChunks = [];
                const readableStream = fs.createReadStream(pathToFile);

                readableStream.on('data', (chunk) => {
                    bufferChunks.push(chunk);
                });

                readableStream.on('end', () => {
                    resolve(Buffer.concat(bufferChunks).toString());
                });

                readableStream.on('error', (err) => {
                    reject(new Error(operationErrorMessage));
                });
            });

        } catch (error) {
            if (error.message === wrongArgumentsMessage) {
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

const rm = async (filePath) => {
    if (await isCorrectPath(filePath) && await isFile(filePath)) {
        try {
            await fsPromises.unlink(path.normalize(filePath));
        } catch (error) {
            new Error(operationErrorMessage);
        }
    } else {
        throw new Error(operationErrorMessage);
    }
}

//The new file name MUST be just the desired new file's NAME without the path.
//The renamed file will be in the same folder as the original file.
const rn = async (pathToFile, newFileName) => {

    if (newFileName.includes('/') || newFileName.includes('\\')) {
        throw new Error(wrongArgumentsMessage);
    }

    if (!await isCorrectPath(pathToFile)) {
        throw new Error(operationErrorMessage);
    }

    try {
        const dirName = path.dirname(path.resolve(pathToFile));
        const destinationFile = path.join(dirName, newFileName);
        await fsPromises.rename(pathToFile, destinationFile)
    } catch (error) {
        throw new Error(operationErrorMessage);
    }
}

const copy = async (pathToFile, pathToNewDirectory) => {

    if (await isCorrectPath(pathToFile) && await isFile(pathToFile) && await isCorrectPath(pathToNewDirectory) && !await isFile(pathToNewDirectory)) {
        try {
            const absolutePathToFile = path.resolve(pathToFile);
            const readStream = fs.createReadStream(absolutePathToFile);
            const destinationFile = path.join(path.resolve(pathToNewDirectory), path.basename(absolutePathToFile));
            const writeStream = fs.createWriteStream(destinationFile);
            readStream.pipe(writeStream);
            writeStream.on('finish', () => {
                console.log('');
            });
        } catch (error) {
            throw new Error(operationErrorMessage);
        }
    } else {
        throw new Error(operationErrorMessage);
    }
}

const mv = async (pathToFile, pathToNewDirectory) => {
    try {
        await copy(pathToFile, pathToNewDirectory);
        await rm(pathToFile);
    } catch (error) {
        throw new Error(operationErrorMessage);
    }
}

export default {up, ls, cd, cat, add, mkdir, mv, rn, rm};
