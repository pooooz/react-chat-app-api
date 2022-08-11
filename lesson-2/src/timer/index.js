import readline from 'readline';
import util from 'util';
import colors from 'colors';
import { EventEmitter } from 'events';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = util.promisify(rl.question).bind(rl);

const emitter = new EventEmitter();

const getDateFromString = (string) => {
  const [date, time] = string.split(' ');
  const [day, month, year] = date.split('.');
  const [hour, minute, second] = time.split(':');

  return new Date(
    Number(year),
    Number(month),
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );
};

const showTime = (timerDate) => {
  const now = new Date();
  if (now >= timerDate) {
    emitter.emit('timerEnd');
  } else {
    const diff = timerDate - now + (now.getTimezoneOffset() * 60 * 1000);
    console.clear();
    console.log('Осталось: ', new Date(diff).toLocaleTimeString().bgCyan);
  }
};

const timerEnded = (timerId) => {
  clearInterval(timerId);
  console.log(colors.bgBlue('Таймер завершил ход'));
  setTimeout(() => process.exit(), 1000);
};

let date;
while (!date) {
  date = await question('Введите дату в формате (ДД.ММ.ГГГГ ЧЧ:ММ:СС): ');
  if (/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}\s(0[1-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/.test(date)) {
    console.log('Дата введена верно!!!');
  } else {
    console.log(colors.red('Неверно указана дата!!! Повторите ввод!'));
    date = undefined;
  }
}

const timerDate = getDateFromString(date);
console.log(timerDate);
const timerId = setInterval(() => {
  emitter.emit('timerTick', timerDate);
}, 1000);

emitter.on('timerTick', showTime);
emitter.on('timerEnd', () => {
  timerEnded(timerId);
});
