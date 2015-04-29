#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import (division, print_function, absolute_import,
                        unicode_literals)

__all__ = ["get_connection", "get_pipeline", "format_key"]

import flask
import redis
redis_pool = None


def get_connection():
    redis_pool = redis.ConnectionPool(port=6379)
    return redis.Redis(connection_pool=redis_pool)


def get_pipeline():
    r = get_connection()
    return r.pipeline()


def format_key(key):
    return "{0}:{1}".format("osrc", key)
