import readline from 'readline';
import util from 'util';
import childProcess from 'child_process';

/**
 * @param {string} string - String to recolor
 * @param {Object} colors - Object whose fields contain colors (order is important)
 * @returns {string} - Colored string
 */
export const colorString = (string, colors) => {
  let counter = 0;
  const colorNames = Object.keys(colors);
  return string.split(' ').map((word) => {
    if (counter === colorNames.length) {
      counter = 0;
    }

    return colors[colorNames[counter++]](word);
  }).join(' ');
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const question = util.promisify(rl.question).bind(rl);
export const execute = util.promisify(childProcess.exec).bind(childProcess);
