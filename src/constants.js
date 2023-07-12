import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const url = 'http://admin:pass@localhost:25984/newdb';
const outputFilename = process.argv[2] || 'perf.csv';
export const perfPath = (filename) => path.resolve(__dirname, '../', 'output', filename || outputFilename);

const v1 = function (doc) {
  if (doc.v1) {
    emit(doc._id, doc._id);
  }
};
const v2 = function (doc) {
  if (doc.v2) {
    emit(doc._id, doc._id);
  }
}

export const ddoc = {
  _id: '_design/ddoc',
  views: {
    v1: { map: v1.toString() },
    v2: { map: v2.toString() },
  }
}
