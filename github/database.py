#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import (division, print_function, absolute_import,
                        unicode_literals)

__all__ = ["get_pipeline", "format_key"]

import redis


def get_pipeline():
    pool = redis.ConnectionPool(host='localhost', port=6379, db=5)
    r = redis.Redis(connection_pool=pool)
    return r.pipeline()


def format_key(key):
    return "{0}:{1}".format("osrc", key)
