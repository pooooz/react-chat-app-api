import inquirer from 'inquirer';
import fs from 'fs';
import childProcess from 'child_process';

const list = fs.readdirSync('./').filter((name) => /^lesson-/.test(name));

inquirer.prompt([
  {
    name: 'dirName',
    type: 'list',
    message: 'Выберите папку урока',
    choices: list,
  },
]).then(({ dirName }) => {
  console.log('Вы выбрали: ', dirName);
  childProcess.fork(`./${dirName}/index.js`);
});
