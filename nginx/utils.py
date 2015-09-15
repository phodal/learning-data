#!/usr/bin/python

import sys
sys.path.append('/Users/fdhuang/test/lib/python2.7/site-packages/')
import pygeoip
gi = pygeoip.GeoIP("data/GeoLiteCity.dat")

@outputSchema('everything:chararray')
def query(url):
    try:
        return url
    except:
        pass

@outputSchema('city:chararray')
def get_city(ip):
    try:
        city = gi.record_by_name(ip)["city"]
        return city
    except:
        pass


@outputSchema('country:chararray')
def get_country(ip):
    try:
        city = gi.record_by_name(ip)["country_name"]
        return city
    except:
        pass

@outputSchema('location:chararray')
def get_geo(ip):
    try:
        geo = str(gi.record_by_name(ip)["longitude"]) + "," + str(gi.record_by_name(ip)["latitude"])
        return geo
    except:
        pass