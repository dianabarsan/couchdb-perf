import write from './write.js';
import { createDb } from './utils.js';
import bulkGet from './bulk-get.js';
import allDocs from './all-docs.js';
import view from './view.js';
import changes from './changes.js';

(async () => {
  await createDb();
  await write();
  await bulkGet();
  await allDocs();
  await view();
  await changes();
})();
