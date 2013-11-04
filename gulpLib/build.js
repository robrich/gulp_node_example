/*jshint node:true */

"use strict";

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var ignore = require('./lib/gulp-ignore');
var ignoreDirectory = require('./lib/gulp-ignore-directory');
var header = require('gulp-header');
var path = require('path');
var fsExtra = require('fs.extra');
var async = require('async');
var es = require('event-stream');

var opts;

var setOpts = function (o) {
	opts = o;
};


var minifyJavaScript = function (cb) {
	var headerText = '/*! '+opts.copyrightHeader+'\r\n   Hash: '+opts.gitHash+'\r\n   Branch: '+opts.gitBranch+'\r\n   Build: '+opts.buildNumber+'\r\n   Build date: {{now}} */';
	var stream = gulp.src('./**/*.js')
		.pipe(ignore(['./node_modules/**','./test/**', './dist/**']))
		.pipe(ignore(['./Gulpfile.js','./gulpLib/**'])) // Ignore gulp content
		.pipe(uglify())
		.pipe(header(headerText))
		.pipe(gulp.dest('./dist'));
	stream.once('end', cb);
};

var copyContentToDist = function (cb) {
	var stream = gulp.src('./**/**')
		.pipe(ignore(['./node_modules/**', './test/**', './dist/**', './**/*.js','./package.json']))
		.pipe(ignore(['./gulpLib/**'])) // Ignore gulp content
		.pipe(ignoreDirectory())
		.pipe(gulp.dest('./dist'));
	stream.once('end', cb);
};

var copyModulesToDist = function (cb) {
	var prodDepObj, prodDepArray = [], p;

	// get the production dependencies from package.json
	prodDepObj = require('../package').dependencies;

	// turn object of {name:version} into an array of [name]
	for (p in prodDepObj) {
		if (prodDepObj.hasOwnProperty(p)) {
			prodDepArray.push(p);
		}
	}

	// copy each to dist
	async.each(
		prodDepArray,
		function (dep, cba) {
			console.log(dep);
			fsExtra.copyRecursive(path.join('./node_modules',dep), path.join('./dist/node_modules',dep), cba);
		},
		cb
	);
};

var setGitInPackageJson = function (cb) {
	var stream = gulp.src('./package.json')
		.pipe(es.map(function (file, cb) {
			var json = JSON.parse(String(file.contents));
			json.git = {
				hash: opts.gitHash,
				branch: opts.gitBranch
			};
			var string = JSON.stringify(json, null, 4);
			file.contents = new Buffer(string);
			cb(null, file);
		}))
		.pipe(gulp.dest('./dist/'));
	stream.once('end', cb);
};

module.exports = {
	setOpts: setOpts,
	minifyJavaScript: minifyJavaScript,
	copyContentToDist: copyContentToDist,
	copyModulesToDist: copyModulesToDist,
	setGitInPackageJson: setGitInPackageJson
};
