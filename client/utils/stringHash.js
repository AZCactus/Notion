const sh = require('shorthash');
const { randomString } = require('../../lib/utils/random');

// 6 letter alpha numeric room name generator
const genRoomName = () => {
  const range = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return randomString(6, 6, range);
};

// returns unique hash from any given str
const genShortHash = (val) => {
  let string;
  if (typeof val === 'string') string = val;
  else if (val.toString) string = val.toString();
  else throw new Error(`What on earth did you just give me? I don't want ${val}`);

  return sh.unique(string);
};

module.exports = {
  genRoomName, genShortHash
};
