import { v4 } from 'uuid';
import { performance } from 'perf_hooks';
import { changes, recordPerf, getRandomExistentDocIds } from './utils.js';

const brackets = [
  100,
  1000,
  10000,
];

const getBracket = async (nbrDocs) => {
  console.log(`_changes ${nbrDocs} random ids`);
  const randomIds = Array.from({ length: nbrDocs }).map(() => v4());
  const beginRandom = performance.now();
  await changes(randomIds);
  await recordPerf(`_changes ${nbrDocs} random ids`, beginRandom);

  const beginRandomIncludeDocs = performance.now();
  const randomIds2 = Array.from({ length: nbrDocs }).map(() => v4());
  await changes(randomIds2, true);
  await recordPerf(`_changes ${nbrDocs} random ids with include_docs`, beginRandomIncludeDocs);


  console.log(`_changes ${nbrDocs} existent ids`);
  const existentIds = await getRandomExistentDocIds(nbrDocs);
  const beginExistent = performance.now();
  await changes(existentIds);
  await recordPerf(`_changes ${nbrDocs} existent ids`, beginExistent);

  const existentIds2 = await getRandomExistentDocIds(nbrDocs);
  const beginExistentIncludeDocs = performance.now();
  await changes(existentIds2, true);
  await recordPerf(`_changes ${nbrDocs} existent ids with include docs`, beginExistentIncludeDocs);
};

export default async () => {
  for (const bracket of brackets) {
    await getBracket(bracket);
  }
};
