import { v4 } from "uuid";
import { performance } from "perf_hooks";
import { allDocs, recordPerf, getRandomExistentDocIds } from './utils.js';

const brackets = [
  100,
  1000,
  10000,
];

const getBracket = async (nbrDocs) => {
  console.log(`_all_docs ${nbrDocs} random ids`);
  const randomIds = Array.from({ length: nbrDocs }).map(() => v4());
  const beginRandom = performance.now();
  await allDocs(randomIds);
  await recordPerf(`_all_docs ${nbrDocs} random ids`, beginRandom);

  const beginRandomIncludeDocs = performance.now();
  const randomIds2 = Array.from({ length: nbrDocs }).map(() => v4());
  await allDocs(randomIds2, true);
  await recordPerf(`_all_docs ${nbrDocs} random ids with include_docs`, beginRandomIncludeDocs);


  console.log(`_all_docs ${nbrDocs} existent ids`);
  const existentIds = await getRandomExistentDocIds(nbrDocs);
  const beginExistent = performance.now();
  await allDocs(existentIds);
  await recordPerf(`_all_docs ${nbrDocs} existent ids`, beginExistent);

  const existentIds2 = await getRandomExistentDocIds(nbrDocs);
  const beginExistentIncludeDocs = performance.now();
  await allDocs(existentIds2, true);
  await recordPerf(`_all_docs ${nbrDocs} existent ids with include docs`, beginExistentIncludeDocs);
};

export default async () => {
  for (const bracket of brackets) {
    await getBracket(bracket);
  }
};
