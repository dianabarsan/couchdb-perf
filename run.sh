set -e

nbr_cpus=$1

docker compose -f ./docker-compose/couchdb-2.yml down
docker compose -f ./docker-compose/couchdb-3.yml down
mkdir -p output

couch2_output=couch2-"$nbr_cpus"_cpu.csv
couch2_data=$(mktemp -d -t couchdb-XXXXXXXXXX)
COUCHDB_DATA=$couch2_data NBR_CPU="$nbr_cpus" docker compose -f ./docker-compose/couchdb-2.yml up -d
sleep 5
node ./src/index.js $couch2_output
docker compose -f ./docker-compose/couchdb-2.yml down

couch3_output=couch3-"$nbr_cpus"_cpu.csv
couch3_data=$(mktemp -d -t couchdb-XXXXXXXXXX)
COUCHDB_DATA=$couch3_data NBR_CPU="$nbr_cpus" docker compose -f ./docker-compose/couchdb-3.yml up -d
sleep 5
node ./src/index.js $couch3_output

docker compose -f ./docker-compose/couchdb-3.yml down

node ./src/compare-results.js $couch2_output $couch3_output merge-"$nbr_cpus"_cpu.csv
