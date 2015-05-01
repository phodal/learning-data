register file:/usr/local/Cellar/pig/0.14.0/libexec/lib/piggybank.jar;
register file:/usr/local/Cellar/pig/0.14.0/libexec/lib/elasticsearch-hadoop-pig-2.1.0.Beta3.jar;
register file:/usr/local/Cellar/pig/0.14.0/libexec/lib/json-simple-1.1.jar;

LOGS = LOAD 'data/2015-01-01-0.json' USING JsonLoader('id:chararray, type:chararray, actor:map[], repo:map[], payload:map[], public:chararray, created_at:chararray');

--B = GROUP A BY (timestamp);
--C = FOREACH B GENERATE FLATTEN(group) as (timestamp), COUNT(A) as count;
--D = ORDER C BY timestamp,count desc;

STORE LOGS INTO 'test';
