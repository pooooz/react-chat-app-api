import inquirer from 'inquirer';
import childProcess from 'child_process';
import colors from 'colors';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await inquirer.prompt([
  {
    name: 'taskName',
    type: 'list',
    message: colors.bgMagenta('\nВыберите задание:'),
    choices: ['news'],
  },
]).then(({ taskName }) => {
  console.log('Вы выбрали: ', taskName);
  const route = path.resolve(__dirname, `src/${taskName}/index.js`);
  childProcess.fork(route);
});
