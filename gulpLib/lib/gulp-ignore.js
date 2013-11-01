/*jshint node:true */

"use strict";

var es = require('event-stream'),
	minimatch = require('minimatch');

module.exports = function(pattern){
	if (typeof pattern === 'string') {
		pattern = [pattern];
	}
	pattern = [].concat(pattern);

	return es.map(function (file, cb){
		var i;
		for (i = 0; i < pattern.length; i++) {
			if (minimatch(file.path, pattern[i])) {
				return cb(); // Ignore this one
			}
		}
		return cb(null, file);
	});
};
