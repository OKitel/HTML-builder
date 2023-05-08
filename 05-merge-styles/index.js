const fs = require('fs');
const path = require('path');

const stylesDirectoryPath = path.join(__dirname, 'styles');
const bundleFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

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
