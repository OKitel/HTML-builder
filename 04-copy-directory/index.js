const fs = require('fs');
const path = require('path');

const copyDirectory = async () => {
  const sourcePath = path.join(__dirname, 'files');
  const destinationPath = path.join(__dirname, 'files-copy');

  await fs.promises.mkdir(destinationPath, { recursive: true });

  const [sourceFiles, destinationFiles] = await Promise.all([
    fs.promises.readdir(sourcePath),
    fs.promises.readdir(destinationPath),
  ]);

  const deleteFiles = destinationFiles.map(async (file) => {
    if (!sourceFiles.includes(file)) {
      const filePath = path.join(destinationPath, file);
      const fileStat = await fs.promises.stat(filePath);
      if (fileStat.isFile()) {
        await fs.unlink(path.join(filePath), () => {});
      }
    }
  });

  await Promise.all(deleteFiles);

  const files = await fs.promises.readdir(sourcePath);

  for (const file of files) {
    const sourceFilePath = path.join(sourcePath, file);
    const destinationFilePath = path.join(destinationPath, file);
    await fs.promises.copyFile(sourceFilePath, destinationFilePath);
  }
};

copyDirectory();
