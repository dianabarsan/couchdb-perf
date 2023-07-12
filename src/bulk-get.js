import { v4 } from 'uuid';
import { performance } from 'perf_hooks';
import { bulkGet, recordPerf, getRandomExistentDocIds } from './utils.js';

const brackets = [
  100,
  1000,
  10000,
];

const getBracket = async (nbrDocs) => {
  console.log(`_bulk_get ${nbrDocs} random ids`);
  const randomIds = Array.from({ length: nbrDocs }).map(() => ({ id: v4() }));
  const beginRandom = performance.now();
  await bulkGet(randomIds);
  await recordPerf(`_bulk_get ${nbrDocs} random ids`, beginRandom);

  console.log(`_bulk_get ${nbrDocs} existent ids`);
  const existentIds = (await getRandomExistentDocIds(nbrDocs)).map((id) => ({ id }));
  const beginExistent = performance.now();
  await bulkGet(existentIds);
  await recordPerf(`_bulk_get ${nbrDocs} existent ids`, beginExistent);
};

export default async () => {
  for (const bracket of brackets) {
    await getBracket(bracket);
  }
};
