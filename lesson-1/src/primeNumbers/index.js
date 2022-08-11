import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import colors from 'colors';

import { colorString } from '../utils/index.js';

(function run() {
  console.log('Попал');
  const { argv } = yargs(hideBin(process.argv));
  if (argv.a > argv.b) {
    throw new Error('Неверно указан диапазон!'.red);
  }
  if (argv.a <= 1) {
    throw new Error('Первое простое число - 2');
  }

  const primes = [];
  for (let i = argv.a; i < argv.b; i++) {
    let isPrime = true;
    for (let j = 2; j < i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      primes.push(i.toString());
    }
  }

  if (!primes.length) {
    console.log('В указанном промежутке нет простых чисел!:( '.blue);
    return;
  }

  const colorsObject = {
    red: colors.red,
    yellow: colors.yellow,
    green: colors.green,
  };

  const coloredPrimes = colorString(primes.join(' '), colorsObject);
  console.log('Результат: ', coloredPrimes);
  process.exit();
}());
