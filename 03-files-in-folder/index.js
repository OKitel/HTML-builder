const fs = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

const listFiles = async () => {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const fileInfo = await fs.stat(path.join(dirPath, file.name));
        const fileNameWithoutExtension = path.basename(
          file.name,
          path.extname(file.name)
        );
        const fileSizeInKB = fileInfo.size / 1024;
        process.stdout.write(
          `${fileNameWithoutExtension} - ${path
            .extname(file.name)
            .substring(1)} - ${fileSizeInKB}kb\n`
        );
      }
    }
  } catch (error) {
    process.stdout.write(error);
  }
};

listFiles();
