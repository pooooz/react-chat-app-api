import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';
import colors from 'colors';

const { argv } = yargs(hideBin(process.argv));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const updateData = (victory, head, tail) => {
  try {
    const fileName = argv.stat;
    let rawData;
    try {
      rawData = fs.readFileSync(path.join(__dirname, fileName));
    } catch (error) {
      const stat = {
        playsCount: 0,
        headsCount: 0,
        tailsCount: 0,
        guessedRight: 0,
      };
      fs.writeFileSync(path.join(__dirname, fileName), JSON.stringify(stat, null, 2));
      rawData = fs.readFileSync(path.join(__dirname, fileName));
    }

    const stat = JSON.parse(rawData);

    // Пришёл из фронта ;)
    const newStat = {
      ...stat,
      playsCount: stat.playsCount + 1,
      headsCount: stat.headsCount + head,
      tailsCount: stat.tailsCount + tail,
      guessedRight: stat.guessedRight + victory,
    };
    const {
      playsCount, headsCount, tailsCount, guessedRight,
    } = newStat;
    console.log('\n');
    console.log(colors.bgCyan(`Статистика игр из файла ${argv.stat}`));
    console.log(`Процент побед: ${(guessedRight / playsCount * 100).toFixed(2)}%`);
    console.log(`Количество попыток: ${playsCount}`);
    console.log(`Количество побед: ${guessedRight}\n`);
    console.log(colors.bgMagenta(`Орлов выпало: ${headsCount}`));
    console.log(colors.bgYellow(`Решек выпало: ${tailsCount}`));
    fs.writeFileSync(path.join(__dirname, fileName), JSON.stringify(newStat, null, 2));
  } catch (error) {
    console.error(error);
  }
};

function getRandomInt(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

(function run() {
  const randomNumber = getRandomInt(0, 1);
  const isVictory = randomNumber === argv.guess ? 1 : 0;
  if (isVictory) {
    console.log(colors.green('Ура! Победа...'));
  } else {
    console.log(colors.red('Вы потерпели поражение...'));
  }
  switch (randomNumber) {
    case 0: {
      console.log('Выпал Орёл!');
      updateData(isVictory, 1, 0);
      break;
    }
    case 1: {
      console.log('Выпала Решка!');
      updateData(isVictory, 0, 1);
      break;
    }
    default: {
      throw new Error('Unexpected behaviour');
    }
  }
}());
