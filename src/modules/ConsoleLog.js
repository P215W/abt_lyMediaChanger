const ConsoleLog = (content) => {
  console.log(`${content}: `, content);
  console.log("Type of Content: ", typeof content);
};

exports.log = ConsoleLog;
