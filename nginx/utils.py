#!/usr/bin/python

import sys
sys.path.append('/Users/fdhuang/py27/lib/python2.7/site-packages/')
import pygeoip


@outputSchema('everything:chararray')
def query(url):
    try:
        return url
    except:
        pass

@outputSchema('location:chararray')
def location(ip):
    try:
        gi = pygeoip.GeoIP("data/GeoLiteCity.dat")
        location = gi.region_by_addr(ip)
        print location
        return ip
    except:
        pass