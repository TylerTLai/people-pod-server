const removeFileExt = (file) => {
  if (file.indexOf('.')) {
    let newFileName = '';
    let dot = file.indexOf('.');
    let fileExt = file.slice(dot);
    // remove exention
    if (fileExt === '.jpg' || fileExt === '.jpeg' || fileExt === '.png') {
      newFileName = file.slice(0, dot);
    }
    return newFileName;
  }

  return file;
};

module.exports = removeFileExt;
