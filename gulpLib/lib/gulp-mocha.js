/*jshint node:true */

"use strict";

var es = require('event-stream');
var Mocha = require('mocha');

module.exports = function(opts, cb){
	var mocha = new Mocha(opts || {});
	var stream = es.map(function (file, cba){
		mocha.addFile(file.path);
		cba(null, file);
	});
	stream.once('end', function () {
		mocha.run(cb);
	});
	return stream;
};
