from pyelasticsearch import ElasticSearch

es = ElasticSearch('http://localhost:9200/')

query = {
    'query': {
        'filtered': {
            'filter': {
                'range': {
                    'date': {
                        'gte': '2015-01-01',
                        'lte': 'now',
                        'time_zone': '+8:00'
                    }
                }
            }
        },
    },
}

print es.search(query, index='nginx')["hits"]["total"]