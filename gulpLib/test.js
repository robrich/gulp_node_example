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
var childProcess = require('child_process');


var opts;

var setOpts = function (o) {
	opts = o;
};

var runJSHint = function (cb) {
	// TODO: junit log at log/jshint.xml
	var jshintSuccess = true; // nothing disputed it yet
	var mess = opts.verbose ? 'linting $file' : '';
	var stream = gulp.src('./**/*.js')
		.pipe(ignore(['./node_modules/**','./dist/**']))
		.pipe(verbose(mess))
		.pipe(jshint(opts.jshint))
		.pipe(jshint.reporterSimple())
		.pipe(es.map(function (file, cb) {
			if (!file.jshint.success) {
				jshintSuccess = false;
			}
			cb(null, file);
		}));
	stream.once('end', function () {
		if (!jshintSuccess) {
			return cb('JSHint failed on one or more files');
		}
		cb();
	});
};

var runMocha = function (cb) {
	gulp.src('./test/**/*.js')
		.pipe(gulpMocha(opts.mocha, cb));
};
// TODO: how to harvest code coverage? !!!!!

var runNpmTest = function (cb) {
	var npm = (process.platform === "win32" ? "npm.cmd" : "npm");
	var s = childProcess.spawn(npm, ['test'], {stdio: 'inherit'});
	s.on('close', function (err) {
		if (err) {
			return cb('npm test errored with exit code '+err);
		}
		cb(null);
	});
};

module.exports = {
	runJSHint: runJSHint,
	runMocha: runMocha,
	runNpmTest: runNpmTest,
	setOpts: setOpts
};
