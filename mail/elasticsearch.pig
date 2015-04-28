/* Set Home Directory - where we install software */

/* Avro uses json-simple, and is in piggybank until Pig 0.12, where AvroStorage and TrevniStorage are builtins */
register file:/usr/local/Cellar/pig/0.14.0/libexec/lib/piggybank.jar;
register file:/usr/local/Cellar/pig/0.14.0/libexec/lib/avro-1.7.5.jar;
register file:/usr/local/Cellar/pig/0.14.0/libexec/lib/json-simple-1.1.jar;
register file:/usr/local/Cellar/elasticsearch/1.4.4/libexec/*.jar;

messages = load 'data/part-1.avro' using AvroStorage();

messages = FILTER messages BY (from IS NOT NULL) AND (tos IS NOT NULL);

addresses = FOREACH messages GENERATE from.address AS from, FLATTEN(tos.(address)) AS to;

lowers = FOREACH addresses GENERATE LOWER(from) AS from, LOWER(to) AS to;

by_from_to = GROUP lowers BY (from, to);
sent_counts = FOREACH by_from_to GENERATE FLATTEN(group) AS (from, to), COUNT_STAR(lowers) AS total;

sent_counts = ORDER sent_counts BY total DESC;

STORE sent_counts INTO 'test';

--STORE sent_count_json INTO 'inbox/sendcounts' USING org.elasticsearch.hadoop.pig.EsStorage();