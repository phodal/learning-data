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

@outputSchema('city:chararray')
def get_city(ip):
    try:
        gi = pygeoip.GeoIP("data/GeoLiteCity.dat")
        city = gi.record_by_name(ip)["city"]
        return city
    except:
        pass


@outputSchema('geo:chararray')
def get_geo(ip):
    try:
        gi = pygeoip.GeoIP("data/GeoLiteCity.dat")
        lntlong = [gi.record_by_name(ip)["latitude"], gi.record_by_name(ip)["longitude"]]
        return str(lntlong)
    except:
        pass