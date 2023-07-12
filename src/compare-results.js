import { perfPath } from './constants.js';

const [,,couch2, couch3, merge] = process.argv;
import { readFile, writeFile } from 'node:fs/promises';

const parseCsv = (src) => src
  .split('\n')
  .map((line) => line.split(','))
  .filter(([action]) => action);

const generateOutput = (action, duration2, duration3) => [
  action,
  parseInt(duration2),
  parseInt(duration3),
  (duration2/duration3).toFixed(2)
].join(',');

(async () => {
  const resultsC2 = parseCsv(await readFile(perfPath(couch2), 'utf-8'));
  const resultsC3  = parseCsv(await readFile(perfPath(couch3), 'utf-8'));

  const coalesced = [['action', 'couch2', 'couch3', 'perf']];

  resultsC2.forEach(([action2, duration2]) => {
    const [,duration3] = resultsC3.find(([action3]) => action3 === action2);
    coalesced.push(generateOutput(action2, duration2, duration3));
  });
  await writeFile(perfPath(merge), coalesced.join('\n'));
})();
