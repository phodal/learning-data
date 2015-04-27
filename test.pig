register file:/usr/local/Cellar/pig/0.14.0/libexec/lib/piggybank.jar;
register file:/usr/local/Cellar/pig/0.14.0/libexec/lib/elasticsearch-hadoop-pig-2.1.0.Beta3.jar;

RAW_LOGS = LOAD 'data/access.log' USING TextLoader as (line:chararray);

LOGS_BASE = FOREACH RAW_LOGS GENERATE
    FLATTEN(
      REGEX_EXTRACT_ALL(line, '(\\S+) - - \\[([^\\[]+)\\]\\s+"([^"]+)"\\s+(\\d+)\\s+(\\d+)\\s+"([^"]+)"\\s+"([^"]+)"\\s+-')
    )
    AS (
        ip: chararray,
        timestamp: chararray,
        url: chararray,
        status: chararray,
        bytes: chararray,
        referrer: chararray,
        useragent: chararray
    );

A = FOREACH LOGS_BASE GENERATE ip,timestamp,url,status,bytes,referrer,useragent;
--B = GROUP A BY (timestamp);
--C = FOREACH B GENERATE FLATTEN(group) as (timestamp), COUNT(A) as count;
--D = ORDER C BY timestamp,count desc;
STORE A INTO 'nginx/log' USING org.elasticsearch.hadoop.pig.EsStorage();
