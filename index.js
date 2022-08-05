import colors from 'colors';

import { question, execute } from './src/utils/index.js';
import {colorString} from './src/utils/index.js';

const getMenuInput = async () => {
  console.log('Меню:'.blue);
  console.log('1. Запустить задание "светофор"!'.rainbow);
  console.log('2. Запустить игу "Орёл или Решка?"!'.rainbow);
  console.log('0. Выйти из меню"!\n'.rainbow);
  console.log('------------\n'.rainbow);

  let answer;
  while (!answer) {
    answer = await question('Введите номер задания для запуска: '.bgMagenta);
    if (!/^\d+$/.test(answer)) {
      console.error('Некорректное значение! Повторите ввод!'.red);
      answer = undefined;
    }
  }
  return answer;
};

const task1 = async () => {
  const greeting = '\n\nДобро пожаловать в приложение "светофор" !\n Оно будет выводить простые числа в заданном диапазоне';

  // Светофор из Японии
  const colorsObj = {
    red: colors.red,
    yellow: colors.yellow,
    blue: colors.blue,
  }
  console.log(colorString(greeting, colorsObj));

  let num1;
  let num2;
  while (!num1 || !num2) {
    console.log('Укажите диапазон чисел в формате [num1, num2]');
    num1 = await question('Введите число num1: ');
    num2 = await question('Введите число num2: ');

    if (Number(num2) < Number(num1) || !/^\d+$/.test(num1) || !/^\d+$/.test(num2)) {
      console.error('Диапазон указан неверно!\nПовторите ввод!!!'.red);
      num1 = undefined;
      num2 = undefined;
    }
  }

  // Вызов дочернего процесса с параметрами
  try {
    const { stdout, stderr } = await execute(`node ./src/primeNumbers/index.js --a ${num1} --b ${num2}`);
    if (!stderr) {
      console.log(stdout);
    }
  } catch (error) {
    console.error(error.stderr.red);
  }
};

const task2 = async () => {
  const greeting = '\n\nДобро пожаловать в игру "Орёл или Решка?" !\n Вам будет предоставлен выбор ;)';
  console.log(greeting);

  let file;
  while (!file) {
    file = await question('Укажите название файла с статистикой (он должен находится в папке headsOrTails): ');
    const questionText = 'Орёл или решка???'.bgCyan + '\n' +
      'Если загадали орла, то введите 0!'.bgMagenta + '\n' +
      'Если загадали решку, то введите 1!'.bgYellow + '\n';
    let guess;
    while (!guess) {
      guess = await question(questionText);
      if (guess !== '0' && guess !== '1') {
        console.error('Выберите орла (0) или решку (1)! Повторите ввод!!!'.red);
        guess = undefined;
      }
    }
    try {
      const { stdout, stderr } = await execute(`node ./src/headsOrTails/index.js --stat ${file} --guess ${guess}`);
      if (!stderr) {
        console.log(stdout);
      }
    } catch (error) {
      console.error(error.stderr);
    }
  }
};

const exit = () => {
  setTimeout(() => console.log('\x07'));
  setTimeout(() => console.log('\x07'), 1000);
  setTimeout(() => console.log('\x07'), 2000);
  setTimeout(() => process.exit(), 3000);
};

const startMenu = async () => {
  let flag = true;
  while (flag) {
    const answer = await getMenuInput();
    switch (Number(answer)) {
      case 1: {
        await task1();
        break;
      }
      case 2: {
        await task2();
        break;
      }
      case 0: {
        flag = false;
        exit();
        break;
      }
      default:
        console.error('В меню нет такого значения! Повторте ввод\n'.red);
        break;
    }
  }
};


(function run() {
  startMenu().catch(error => console.error(error));
})()