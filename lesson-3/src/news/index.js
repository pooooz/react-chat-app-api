import fetch from 'node-fetch';
import inquirer from 'inquirer';
import colors from 'colors';
import * as dotenv from 'dotenv';

dotenv.config();
const API_KEY = process.env.NEWS_API_KEY;
const country = 'jp';

try {
  const response = await fetch(`https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${API_KEY}`);
  const data = await response.json();

  if (data.code === 'apiKeyInvalid') {
    throw new Error('Invalid API key');
  }

  if (data.totalResults) {
    const articleTitles = data.articles.map(({ title }) => title);

    await inquirer.prompt([
      {
        name: 'articleTitle',
        type: 'list',
        message: colors.bgMagenta('\nВыберите название статьи:'),
        choices: articleTitles,
      },
    ]).then(({ articleTitle }) => {
      const { description, url, publishedAt } = data.articles
        .find(({ title }) => title === articleTitle);
      console.log(colors.red('Описание: '), colors.red(description));
      console.log(colors.green('Опубликована: '), colors.green(new Date(publishedAt).toLocaleString()));
      console.log(colors.blue('Ссылка на статью: '), url);
    });
  } else {
    throw new Error('Unable to find news for this country');
  }
} catch (error) {
  console.error(colors.red(error));
}
