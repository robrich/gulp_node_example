/*jshint node:true */

"use strict";

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var ignore = require('./lib/gulp-ignore');
var verbose = require('./lib/gulp-verbose');
var es = require('event-stream');
//var fs = require('fs');
//var path = require('path');
//var Mocha = require('mocha');
var gulpMocha = require('./lib/gulp-mocha');


var opts;

var setOpts = function (o) {
	opts = o;
};

var runJSHint = function (cb) {
	// TODO: junit log at log/jshint.xml
	var jshintSuccess = true; // nothing disputed it yet
	var mess = opts.verbose ? 'linting $file' : '';
	var stream = gulp.src('./**/*.js')
		.pipe(ignore(['./node_modules/**']))
		.pipe(verbose(mess))
		.pipe(jshint(opts.jshint))
		.pipe(es.map(function (file, cb) {
			if (!file.jshint.success) {
				jshintSuccess = false;
				file.jshint.results.forEach(function (err/*, index*/) {
					console.log(err.mess);
				});
			}
			cb(null, file);
		}));
	stream.once('end', function () {
		if (!jshintSuccess) {
			return cb('JSHint failed on one or more files');
			//throw new Error('JSHint failed on one or more files');
		}
		cb();
	});
};

/*
var runMocha = function (cb) {

	var mocha = new Mocha(opts.mocha || {});

	// TODO: is this recursive?
	fs.readdirSync('test').filter(function(file){
		return file.substr(-3) === '.js'; // Only keep the .js files
	}).forEach(function(file){
		mocha.addFile(path.join('test', file));
	});

	mocha.run(cb);
}
*/
var runMocha = function (cb) {
	gulp.src('./test/**/*.js')
		.pipe(gulpMocha(opts.mocha, cb));
};

module.exports = {
	runJSHint: runJSHint,
	runMocha: runMocha,
	setOpts: setOpts
};
