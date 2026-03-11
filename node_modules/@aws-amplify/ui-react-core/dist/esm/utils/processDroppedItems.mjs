// Helper function to convert FileSystemFileEntry to File
const getFileFromEntry = (fileEntry) => {
    return new Promise((resolve) => {
        fileEntry.file(resolve);
    });
};
// Helper function to read all entries in a directory
const readAllDirectoryEntries = async (dirReader) => {
    const entries = [];
    let readBatch = [];
    do {
        readBatch = await new Promise((resolve, reject) => {
            try {
                dirReader.readEntries(resolve, reject);
            }
            catch (error) {
                reject(error);
            }
        });
        entries.push(...readBatch);
    } while (readBatch.length > 0);
    return entries;
};
// Helper function to process files and folder contents
async function processDroppedItems(dataTransferItems) {
    const files = [];
    const processFileSystemEntry = async (entry) => {
        if (entry.isFile) {
            const file = await getFileFromEntry(entry);
            // drag and dropped files do not have a webkitRelativePath property,
            // but they do have a fullPath property which has the same information
            // https://github.com/ant-design/ant-design/issues/16426
            if (entry.fullPath && !file.webkitRelativePath) {
                Object.defineProperties(file, {
                    webkitRelativePath: {
                        writable: true,
                    },
                });
                // intentionally overwriting webkitRelativePath
                // @ts-expect-error
                file.webkitRelativePath = entry.fullPath.replace(/^\//, '');
                Object.defineProperties(file, {
                    webkitRelativePath: {
                        writable: false,
                    },
                });
            }
            files.push(file);
        }
        else if (entry.isDirectory) {
            const dirReader = entry.createReader();
            const dirEntries = await readAllDirectoryEntries(dirReader);
            await Promise.all(dirEntries.map(processFileSystemEntry));
        }
    };
    // Filter out and process files from the data transfer items
    await Promise.all(dataTransferItems
        .reduce((acc, item) => {
        const entry = item.webkitGetAsEntry();
        return item.kind === 'file' && entry ? [...acc, entry] : acc;
    }, [])
        .map(processFileSystemEntry));
    return files;
}

export { processDroppedItems };
