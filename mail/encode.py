import base64

#My buggy SSH account needs this to write unicode output, you hopefully won't
import sys
import codecs
sys.stdout = codecs.getwriter('utf-8')(sys.stdout)


encoded = '=?UTF-8?B?UmU6IFNjYWxlV29ya3MgRGV2T3Bz5Lqn5ZOB5pa55qGINC4yMue9keS4iuaOqOS7i+S8mg==?='
prefix = '=?UTF-8?B?'
suffix = '?='

#extract the data part of the string
middle = encoded[len(prefix):len(encoded)-len(suffix)]
print "Middle: %s" % middle

#decode the bytes
decoded = base64.b64decode(middle)
#decode the utf-8
decoded = unicode(decoded, 'utf8')

print decoded