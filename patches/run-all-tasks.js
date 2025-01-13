const deleteFilesAndDirectories = require('./delete-files-and-directories');
// const customTask = require('./custom-task');

function runAllTasks() {
  deleteFilesAndDirectories();
//   customTask();
}

runAllTasks();
