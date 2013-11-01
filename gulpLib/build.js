/*jshint node:true */

"use strict";

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var ignore = require('./lib/gulp-ignore');
var header = require('gulp-header');
var path = require('path');
var fsExtra = require('fs.extra');
var async = require('async');
var gulpExec = require('gulp-exec');

var opts;

var setOpts = function (o) {
	opts = o;
};


var runBuild = function (cb) {
	var headerText = '/*! '+opts.copyrightHeader+'\r\nHash: '+opts.gitHash+', Build: '+opts.buildNumber+' {{now}} */';
	var stream = gulp.src('./**/*.js')
		.pipe(ignore(['./node_modules/**','./test/**']))
		.pipe(uglify())
		.pipe(header(headerText))
		.pipe(gulp.dest('./dist'));
	stream.once('end', cb);
};

var copyContentToDist = function (cb) {
	var stream = gulp.src('./**/**')
		.pipe(ignore(['./node_modules/**', './test/**', './**/*.js']))
		.pipe(gulp.dest('./dist'));
	stream.once('end', cb);
};

var copyModulesToDist = function (cb) {
	var prodDependencies = require('../package').dependencies;
	async.each(
		prodDependencies,
		function (dep, cba) {
			fsExtra.copyRecursive(path.join('node_modules',dep), path.join('dest/node_modules',dep), cba);
		},
		cb
	);
};

var setGitHashInPackageJson = function (cb) {
	var stream = gulp.src('./package.json')
		.pipe(gulpExec('git checkout "$file"'))
		.pipe(gulp.dest('./dist/package.json'));
	stream.once('end', cb);
};

module.exports = {
	setOpts: setOpts,
	runBuild: runBuild,
	copyContentToDist: copyContentToDist,
	copyModulesToDist: copyModulesToDist,
	setGitHashInPackageJson: setGitHashInPackageJson
};