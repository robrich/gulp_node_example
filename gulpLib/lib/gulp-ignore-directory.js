/*jshint node:true */

"use strict";

var es = require('event-stream');

module.exports = function(){
	return es.map(function (file, cb){
		if (file.isDirectory) {
			return cb(); // Ignore this one
		}
		return cb(null, file);
	});
};
