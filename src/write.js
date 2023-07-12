import { v4 } from "uuid";
import { performance } from "perf_hooks";
import { writeDocs, recordPerf, indexView } from './utils.js';

const nbrDocs = 250000; // 250k
const batchSize = 10000;

const v1Docs = Array
  .from({ length: nbrDocs })
  .map(() => ({ _id: v4(), v1: true }));

const v2Docs = Array
  .from({ length: nbrDocs })
  .map(() => ({ _id: v4(), v2: true }));

export default async () => {
  const begin = performance.now();
  while (v1Docs.length) {
    console.log(`writing batch, ${v1Docs.length} left`);
    const batch = v1Docs.splice(0, batchSize);
    await writeDocs(batch);
  }
  while (v2Docs.length) {
    console.log(`writing batch, ${v2Docs.length} left`);
    const batch = v2Docs.splice(0, batchSize);
    await writeDocs(batch);
  }
  await recordPerf('writing docs', begin);

  const beginIndexing = performance.now();
  await indexView();
  await recordPerf('indexing docs', beginIndexing);
};
