const AdjustUrl = (url) => {
  // fixes number issue:
  const numberRegex = /\d/g;
  const numberParts = url.match(numberRegex);
  const number = numberParts.join("");
  const indexOfNumber = url.indexOf(number);
  const numberErasedUrl = url.substring(0, indexOfNumber) + "html";

  // fixes parenthesis issue:
  const index1 = numberErasedUrl.lastIndexOf("-");

  let newUrl;
  if (index1 !== -1) {
    const index2 = numberErasedUrl.indexOf(".html");
    const parenthesesString = numberErasedUrl.substr(index1, index2);
    const adjustedParenthesesString = parenthesesString
      .replace("-", "-(")
      .replace(".", ").");

    const indexHyphen = numberErasedUrl.lastIndexOf("-");
    const urlWithoutParenthesesPart = numberErasedUrl.substr(0, indexHyphen);
    newUrl = urlWithoutParenthesesPart + adjustedParenthesesString;
  } else {
    newUrl = numberErasedUrl;
  }

  return newUrl;
};

exports.data = AdjustUrl;
