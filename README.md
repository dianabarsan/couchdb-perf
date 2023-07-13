# CouchDb 2 vs CouchDb 3 superficial performance bench

### Method

- Start CHT version of CouchDb
- create one database
- create one ddoc with two views
- write 500.000 (five hundred thousand) documents. These documents consist of one uuid as _id field and one static boolean property. Half of the documents will be indexed by one view, and the other half by the other. Record time it takes to write all documents.
- call _bulk_get with payloads of 100, 1000 and 10000 known vs unknown doc ids and record response time.
- call _all_docs with payloads of 100, 1000 and 10000 known vs unknown doc ids, with and without include_docs, and record response time.
- call one view with payloads of 100, 1000 and 10000 known vs unknown keys, with and without include_docs, and record response time.
- call _changes with payloads of 100, 1000 and 10000 known vs unknown ids, with and without include_docs, and record response time.

### Execution
- spin up AWS EC2 instance
- spin up CHT CouchDb 2 (v4.2.2) container
- run above script above
- spin up CHT CouchDb 3 (branch) container
- run above script above
- merge results
