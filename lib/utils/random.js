'use strict';

const rgbtohex = require('rgb-hex');

/**
 * Helper function that returns a random Integer within the provided range.
 *
 * @arg {Integer} min The start of the desired range
 * @arg {Integer} max The end of the desired range
 * @arg {Boolean =true} inclusive Determines whether or not to be inclusive
 *                               at the maximum of the range.
 * @arg {Array | Integer =[]} excluded A number or array of numbers to exclude from the results.
 *
 * @returns {Integer}
 */
function randomNumber(min, max, inclusive = true, excluded = []) {
  excluded = Array.isArray(excluded) ? excluded : [ excluded ];
  excluded.sort((a, b) => a - b);
  max -= excluded.length;

  let random = Math.floor(
      Math.random() * (min - max) + (inclusive ? max : 0)
  );

  for (let i = 0; i < excluded.length; i++) {
    if (random >= excluded[i]) random++;
  }

  return random;
}

/**
 * Helper function that returns a random alphanumeric string with a
 * length within the range provided.
 *
 * @arg {Integer} min The minimum length of the random string
 * @arg {Integer} max The maximum length of the random string. If this argument
 *                    is excluded the string length will match the `min` argument.
 * @arg {String} chars A string containing the characters you want to limit the string to.
 *
 * @returns {String}
 */
function randomString(min, max, chars) {
  const charCodeRange = [ 48, 90 ];
  const excludedCharCodes = [ 58, 59, 60, 61, 62, 63, 64 ];
  const length = typeof max === 'number' ? randomNumber(min, max) : min;
  let string = '';

  while (string.length < length) {
    if (chars) {
      string += chars[randomNumber(0, chars.length, false)];
    } else {

      string += String.fromCharCode(
        randomNumber(charCodeRange[0], charCodeRange[1], true, excludedCharCodes)
      );
    }
  }

  return string;
}

/**
 * Helper function that returns a random color in hex format.
 * @returns {String}
 */
function randomColor() {
  return rgbtohex(
    randomNumber(0, 255),
    randomNumber(0, 255),
    randomNumber(0, 255)
  );
}

module.exports = {
  randomNumber, randomString, randomColor
};
