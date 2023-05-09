const fs = require('fs');
const path = require('path');

const destinationPath = path.join(__dirname, 'project-dist');
const templateHtmlPath = path.join(__dirname, 'template.html');
const indexHtmlPath = path.join(destinationPath, 'index.html');
const componentsPath = path.join(__dirname, 'components');

const createDirectory = async () => {
  await fs.promises.mkdir(destinationPath, { recursive: true });
};

const bundleCss = async () => {
  const stylesDirectoryPath = path.join(__dirname, 'styles');
  const bundleFilePath = path.join(destinationPath, 'style.css');

  fs.readdir(stylesDirectoryPath, (error, files) => {
    if (error) throw error;

    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    const stylesPromises = cssFiles.map((file) => {
      const filePath = path.join(stylesDirectoryPath, file);
      return fs.promises.readFile(filePath, 'utf8');
    });

    Promise.all(stylesPromises)
      .then((styles) => {
        const stylesData = styles.join('\n');
        fs.writeFile(bundleFilePath, stylesData, (error) => {
          if (error) throw error;
        });
      })
      .catch((error) => {
        throw error;
      });
  });
};

const createIndex = async () => {
  await fs.promises.copyFile(templateHtmlPath, indexHtmlPath);
  const files = await fs.promises.readdir(componentsPath);

  for (const file of files) {
    if (path.extname(file).toLowerCase() === '.html') {
      const component = `{{${path.basename(file, path.extname(file))}}}`;
      const componentsContent = await fs.promises.readFile(
        path.join(componentsPath, file),
        'utf-8'
      );

      let indexFile = await fs.promises.readFile(indexHtmlPath, 'utf-8');
      indexFile = indexFile.replace(component, componentsContent);
      await fs.promises.writeFile(indexHtmlPath, indexFile);
    }
  }
};

const copyAssets = async () => {
  const assetsSourcePath = path.join(__dirname, 'assets');
  const assetsDestinationPath = path.join(destinationPath, 'assets');
  await fs.promises.rm(assetsDestinationPath, { recursive: true, force: true });

  const deepCopy = async (sourcePath, destinationPath) => {
    await fs.promises.mkdir(destinationPath);
    const files = await fs.promises.readdir(sourcePath);
    for (const file of files) {
      const sourceFilePath = path.join(sourcePath, file);
      const destinationFilePath = path.join(destinationPath, file);
      const fileStats = await fs.promises.stat(sourceFilePath);
      if (fileStats.isFile()) {
        await fs.promises.copyFile(sourceFilePath, destinationFilePath);
      } else {
        await deepCopy(sourceFilePath, destinationFilePath);
      }
    }
  };
  deepCopy(assetsSourcePath, assetsDestinationPath);
};

const buildPage = async () => {
  await createDirectory();
  await bundleCss();
  await createIndex();
  await copyAssets();
};

buildPage();
