// Usage=============================================================
var express = require('express');
var router = express.Router();
var sharejsaof = require('../../src/api/controllers/sharejsaof.controller');

// Construct a `RedisStatus` object configured to check the status of
// the Redis server named 'foo' at `redis//localhost:6379`.
sharejsaof({
    name: 'foo',
    port: 6379,
    host: 'localhost'
});
