register file:/usr/local/Cellar/pig/0.14.0/libexec/lib/piggybank.jar;
register file:/usr/local/Cellar/pig/0.14.0/libexec/lib/avro-1.7.5.jar;
register file:/usr/local/Cellar/pig/0.14.0/libexec/lib/json-simple-1.1.jar;
register file:/usr/local/Cellar/elasticsearch/1.4.4/libexec/*.jar;
register utils.py using jython as utils;

messages = load 'data/part-1.avro' using AvroStorage();

messages = FILTER messages BY (from IS NOT NULL) AND (tos IS NOT NULL) AND (subject IS NOT NULL);

info = FOREACH messages GENERATE from.address AS from, FLATTEN(tos.(address)) AS to, subject, date;

STORE info INTO 'inbox/sendcounts' USING org.elasticsearch.hadoop.pig.EsStorage();