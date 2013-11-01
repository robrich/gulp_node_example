/*jshint node:true */

"use strict";

var es = require('event-stream');
var events = require('events');
var EventEmitter = events.EventEmitter;
var eventEmitter = new EventEmitter();

var verbose = function() {
	return es.map(function (file, cb){
		verbose.emit('file', file);
		return cb(null, file);
	});
};

// verbose is a singleton not a constructor, so "fake" inherit the necessary methods
verbose.emit = eventEmitter.emit;
verbose.on = eventEmitter.on;
verbose.once = eventEmitter.once;
verbose.addListener = eventEmitter.addListener;
verbose.removeListener = eventEmitter.removeListener;

module.exports = verbose;
