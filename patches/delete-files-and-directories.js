const fs = require("fs");
const path = require("path");

function deleteFilesAndDirectories() {
  // Replace 'XYZ' with your specific package name
  const packageName = "react-native-qrcode-scanner";

  // List of directories to delete (relative to the package's root directory)
  const dirsToDelete = ["node_modules/react-native-permissions"];

  // List of files to delete (relative to the package's root directory)
  const filesToDelete = [];

  // Base path for the package
  const basePath = path.join(__dirname, "../node_modules", packageName);

  // Function to delete directories
  function deleteDirectories() {
    dirsToDelete.forEach((dir) => {
      const dirPath = path.join(basePath, dir);
      if (fs.existsSync(dirPath)) {
        fs.rm(dirPath, { recursive: true, force: true }, (err) => {
          if (err) {
            console.error(`Failed to delete directory ${dirPath}:`, err);
          } else {
            console.log(`Successfully deleted directory ${dirPath}`);
          }
        });
      } else {
        console.log(`Directory not found: ${dirPath}. No action taken.`);
      }
    });
  }

  // Function to delete files
  function deleteFiles() {
    filesToDelete.forEach((file) => {
      const filePath = path.join(basePath, file);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Failed to delete file ${filePath}:`, err);
          } else {
            console.log(`Successfully deleted file ${filePath}`);
          }
        });
      } else {
        console.log(`File not found: ${filePath}. No action taken.`);
      }
    });
  }

  // Check if the package exists in node_modules
  if (fs.existsSync(basePath)) {
    deleteDirectories();
    deleteFiles();
  } else {
    console.log(`Package not found: ${packageName}. No action taken.`);
  }
}


module.exports = deleteFilesAndDirectories;