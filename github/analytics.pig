register file:/usr/local/Cellar/pig/0.14.0/libexec/lib/piggybank.jar;
register file:/usr/local/Cellar/pig/0.14.0/libexec/lib/elasticsearch-hadoop-pig-2.1.0.Beta3.jar;
register file:/usr/local/Cellar/pig/0.14.0/libexec/lib/elephant-bird-core-4.6.jar;
register file:/usr/local/Cellar/pig/0.14.0/libexec/lib/elephant-bird-hadoop-compat-4.6.jar;
register file:/usr/local/Cellar/pig/0.14.0/libexec/lib/elephant-bird-pig-4.6.jar;

LOGS = LOAD 'data/2015-01-01-0.json' USING com.twitter.elephantbird.pig.load.JsonLoader() AS (json:map[]);

B = FOREACH LOGS GENERATE json#'created_at' AS created_at, json#'actor' AS actor, json#'repo' AS repo, json#'payload' AS payload;

STORE B INTO 'github/log' USING org.elasticsearch.hadoop.pig.EsStorage();

