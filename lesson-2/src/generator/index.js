import readline from 'readline';
import util from 'util';
import colors from 'colors';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = util.promisify(rl.question).bind(rl);

const getRandomInt = (min, max) => {
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};

const getRandomIp = () => {
  let ip = '';
  for (let i = 0; i < 4; i++) {
    ip += `${getRandomInt(0, 255)}`;
    if (i !== 3) {
      ip += '.';
    } else {
      ip += ' ';
    }
  }
  return ip;
};

const getRandomTime = () => {
  const hour = getRandomInt(0, 23);
  const minute = getRandomInt(0, 59);
  const second = getRandomInt(0, 59);

  return `${hour <= 9 ? `0${hour}` : hour}:${minute <= 9 ? `0${minute}` : minute}:${second <= 9 ? `0${second}` : second}`;
};

const getRandomMask = () => {
  const methods = ['GET', 'POST', 'DELETE', 'PUT', 'HEAD', 'OPTIONS', 'TRACE', 'PATCH'];
  return `- - [25/May/2021:${getRandomTime()} +0000] "${methods[getRandomInt(0, methods.length - 1)]} /baz HTTP/1.1" 200 0 "-" "curl/7.47.0"`;
};

const getMaskWithDefinedIp = (ip) => `${ip} ${getRandomMask()}`;

const printProgressBar = (progress, total) => {
  const percent = Math.round(progress / total * 100);
  const index = Math.floor(percent / 10);
  let bar = '[';
  for (let i = 0; i < index; i++) {
    bar += colors.bgGreen('*');
  }
  for (let i = index; i < 10; i++) {
    bar += '-';
  }
  bar += ']';
  console.log(bar);
};

const fileName = 'generatedIp.log';

if (fs.existsSync(path.join(__dirname, fileName))) {
  fs.unlinkSync(path.join(__dirname, fileName));
}

fs.appendFileSync(path.join(__dirname, fileName), `${getMaskWithDefinedIp('192.14.19.1')}\n`);

let fileSize = 0;
const totalSize = 1000000;
while (fileSize < totalSize) {
  fileSize = fs.statSync(path.join(__dirname, fileName)).size;
  console.clear();
  console.log('Генерация файла');
  printProgressBar(fileSize, totalSize);
  fs.appendFileSync(path.join(__dirname, fileName), `${getRandomIp() + getRandomMask()}\n`);
}
console.log(colors.green('DONE!'));

let answer;
while (!answer) {
  answer = await question('Введите искомый IPv4 адрес: ');
  if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(answer)) {
    console.error(colors.red('Неверно указан ip адрес! Повторите ввод'));
    answer = undefined;
  }
}

console.log('\nАдрес указан верно: ', colors.bgMagenta(answer));

const requestsFilePath = `${answer}_requests.log`;
if (fs.existsSync(path.join(__dirname, requestsFilePath))) {
  fs.unlinkSync(path.join(__dirname, requestsFilePath));
}

let foundCount = 0;
const fileContents = fs.readFileSync(path.join(__dirname, fileName), 'utf-8');
fileContents.split(/\r?\n/).forEach((line) => {
  if (line.includes(answer)) {
    fs.appendFileSync(path.join(__dirname, requestsFilePath), line);
    foundCount++;
  }
});

console.log(`\nIP ${colors.bgMagenta(answer)} был найден ${foundCount} раз(а)`);
console.log('Результат находится в файле: ', requestsFilePath);

process.exit();
