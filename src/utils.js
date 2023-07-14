import { default as rpn }from 'request-promise-native';
import * as constants from './constants.js';
import { performance } from "perf_hooks";
import { appendFile } from 'node:fs/promises';
import { shuffle } from 'lodash-es';

const url = constants.url;
rpn.defaults({ json: true, uri: url });
let dbUuids;
let v1keys;

const handleError = (err) => {
  delete err.request;
  delete err.response;
  throw err;
}
const request = {
  get: (opts) => rpn.get(opts).catch(handleError),
  put: (opts) => rpn.put(opts).catch(handleError),
  post: (opts) => rpn.post(opts).catch(handleError),
};

export const createDb = async () => {
  await request.put({ url });
};

export const createDdoc = async () => {
  await request.post({ url, body: constants.ddoc, json: true });
};

export const recordPerf = async (description, start) => {
  const end = performance.now();
  await appendFile(constants.perfPath(), `${description},${end-start}\n`);
};

export const writeDocs = async (docs) => {
  await request.post({
    url: `${url}/_bulk_docs`,
    body: { docs },
    json: true
  });
};

export const indexViewRecursive = async () => {
  console.log('indexing views...');
  try {
    const viewName = Object.keys(constants.ddoc.views)[0];
    const viewUrl = `${constants.ddoc._id}/_view/${viewName}?limit=1`;
    return await request.get({ url: `${url}/${viewUrl}` });
  } catch (err) {
    return await indexViewRecursive();
  }
};

export const bulkGet = async (payload) => {
  await request.post({
    url: `${url}/_bulk_get`,
    body: { docs: payload },
    json: true
  });
};

export const getRandomExistentDocIds = async (nbr) => {
  if (!dbUuids) {
    console.log('getting db ids');
    const r = await request.get({ url: `${url}/_all_docs`, json: true });
    dbUuids = r.rows.map(row => row.id);
  }

  const mixed = shuffle(dbUuids);
  return mixed.splice(0, nbr);
};

export const getRandomv1keys = async (nbr) => {
  if (!v1keys) {
    console.log('getting v1 keys');
    const r = await request.get({
      url: `${url}/_design/ddoc/_view/v1`,
      json: true
    });
    v1keys = r.rows.map(row => row.key);
  }

  const mixed = shuffle(v1keys);
  return mixed.splice(0, nbr);
};1

export const allDocs = async (docIds, includeDocs = false) => {
  await request.post({
    url: `${url}/_all_docs?include_docs=${includeDocs ? 'true':'false'}`,
    body: { keys: docIds },
    json: true
  });
};

export const view = async (keys, includeDocs = false) => {
  await request.post({
    url: `${url}/_design/ddoc/_view/v1?include_docs=${includeDocs ? 'true':'false'}`,
    body: { keys: keys },
    json: true
  });
};

export const changes = async (keys, includeDocs = false) => {
  await request.post({
    url: `${url}/_changes?filter=_doc_ids&include_docs=${includeDocs ? 'true':'false'}`,
    body: { doc_ids: keys },
    json: true
  });
}

export const indexView = async () => {
  const beginIndexing = performance.now();
  await indexViewRecursive();
  await recordPerf('indexing docs', beginIndexing);
};
