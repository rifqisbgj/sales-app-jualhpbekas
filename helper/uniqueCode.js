const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateUniqueCode = () => {
  let tokens = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    chars = 4,
    segments = 2,
    keyString = "";

  for (let i = 0; i < segments; i++) {
    let segment = "";

    for (let j = 0; j < chars; j++) {
      let k = getRandomInt(0, 35);
      segment += tokens[k];
    }

    keyString += segment;

    if (i < segments - 1) {
      keyString += "-";
    }
  }

  return keyString;
};

module.exports = generateUniqueCode;
