const convertTypetoExt = (type) => {
  let slash = type.indexOf('/') + 1;
  let ext = '.' + type.slice(slash);
  return ext;
};

module.exports = convertTypetoExt;
