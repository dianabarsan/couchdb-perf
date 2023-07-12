import { v4 } from "uuid";
import { performance } from "perf_hooks";
import { view, recordPerf, getRandomv1keys } from './utils.js';

const brackets = [
  100,
  1000,
  10000,
];

const getBracket = async (nbrDocs) => {
  console.log(`_view ${nbrDocs} random ids`);
  const randomIds = Array.from({ length: nbrDocs }).map(() => v4());
  const beginRandom = performance.now();
  await view(randomIds);
  await recordPerf(`_view ${nbrDocs} random ids`, beginRandom);

  const beginRandomIncludeDocs = performance.now();
  const randomIds2 = Array.from({ length: nbrDocs }).map(() => v4());
  await view(randomIds2, true);
  await recordPerf(`_view ${nbrDocs} random ids with include_docs`, beginRandomIncludeDocs);


  console.log(`_view ${nbrDocs} existent ids`);
  const existentIds = await getRandomv1keys(nbrDocs);
  const beginExistent = performance.now();
  await view(existentIds);
  await recordPerf(`_view ${nbrDocs} existent ids`, beginExistent);

  const existentIds2 = await getRandomv1keys(nbrDocs);
  const beginExistentIncludeDocs = performance.now();
  await view(existentIds2, true);
  await recordPerf(`_view ${nbrDocs} existent ids with include docs`, beginExistentIncludeDocs);
};

export default async () => {
  for (const bracket of brackets) {
    await getBracket(bracket);
  }
};
