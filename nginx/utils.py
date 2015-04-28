import urllib2
 
@outputSchema('everything:chararray')
def query(url):
    try:
        print url
        return url
    except:
        pass