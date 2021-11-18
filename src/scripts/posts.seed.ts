import setupConnection from '../setup/typeorm';
import { loremIpsum } from 'lorem-ipsum';
import Post from '../entity/Post';

setupConnection().then(async (connection) => {

  const lorem = (words: number) => (
    loremIpsum({
      count: words,
      units: 'words',
    })
  );
  const valuesArray = [];
  for (let i = 10; i > 0; i--) {
    valuesArray.push({
      title: lorem(2),
      author: lorem(2),
      content: lorem(45),
    });
  }

  await connection.createQueryBuilder()
    .insert()
    .into(Post)
    .values(valuesArray)
    .execute();

  console.log('Posts seed succeed');
  process.exit();
});
