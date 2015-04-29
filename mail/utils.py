#!/usr/bin/python

import sys

sys.path.append('/Users/fdhuang/py27/lib/python2.7/site-packages/')
import base64
import codecs

sys.stdout = codecs.getwriter('utf-8')(sys.stdout)
prefix = '=?UTF-8?B?'
suffix = '?='


@outputSchema('subject:chararray')
def encode_subject(subject):
    try:

        if prefix in subject and subject:
            middle = subject[len(prefix):len(subject) - len(suffix)]
            decoded = base64.b64decode(middle)
            subject = unicode(decoded, 'utf8')

        return subject
    except:
        pass