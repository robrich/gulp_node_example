/*jshint node:true */

"use strict";

var gulp = require('gulp');

var clean = require('./gulpLib/clean');
var version = require('./gulpLib/version');
var test = require('./gulpLib/test');
var build = require('./gulpLib/build');
var deploy = require('./gulpLib/deploy');


var opts = {
	debug: false,
	buildNumber: process.env.BUILD_NUMBER,
	copyrightHeader: 'Copyright {{year}} MyCompany, All Rights Reserved',
	deployLocation: 'D:\\JenkinsDrops\\WSB_All',
	verbose: true
};

opts.jshint = {
	"evil": false,
	"regexdash": false,
	"browser": false,
	"wsh": false,
	"trailing": false,
	"sub": false,
	"bitwise": true,
	"camelcase": true,
	"curly": true,
	"eqeqeq": true,
	"forin": true,
	"immed": true,
	"latedef": true,
	"newcap": true,
	"noarg": true,
	"noempty": true,
	"nonew": true,
	"regexp": true,
	"undef": true,
	"unused": true,
	"strict": true
};

opts.mocha = {
};

gulp.onAll(function (e) {
	if (opts.verbose) {
		console.log('');
		console.log('  gulp:'+e.src+(e.task?', task:'+e.task:'')+', mess:"'+e.mess+'"'); // show start and end for each task
	}
	if (e.err) {
		throw e.err;
	}
});


var noop = function () {};


// default task gets called when you run `gulp` with no arguments
gulp.task('default', ['clean', 'version', 'test', 'build', 'deploy'], noop);

// The main 5 steps:
gulp.task('clean', ['cleanVersioned', 'cleanUnversioned'], noop);
gulp.task('version', ['getGitHash'], noop);
gulp.task('test', ['clean', 'runJSHint', 'runMocha'], noop);
gulp.task('build', ['clean','test','runBuild', 'copyContentToDist', 'copyModulesToDist', 'setGitHashInPackageJson'], noop);
gulp.task('deploy', ['test','build', 'copyToDeployLocation'], noop);

// clean

gulp.task('cleanUnversioned', ['setOpts'], clean.cleanUnversioned);
gulp.task('cleanVersioned', ['setOpts'], clean.cleanVersioned);

// version

gulp.task('getGitHash', ['setOpts'], version.getGitHash);

// test

gulp.task('runJSHint', ['setOpts', 'clean'], test.runJSHint);
gulp.task('runMocha', ['clean'], test.runCssLint);

// build

gulp.task('runBuild', ['clean', 'setOpts'], build.runBuild);
gulp.task('copyContentToDist', ['clean', 'setOpts'], build.copyContentToDist);
gulp.task('copyModulesToDist', ['clean', 'setOpts'], build.copyModulesToDist);
gulp.task('setGitHashInPackageJson', ['setOpts', 'getGitHash'], build.setGitHashInPackageJson);

// deploy

gulp.task('copyToDeployLocation', ['setOpts','test','build'], deploy.copyToDeployLocation);

// generic

gulp.task('setOpts', function () {
	clean.setOpts(opts);
	version.setOpts(opts);
	build.setOpts(opts);
	test.setOpts(opts);
	deploy.setOpts(opts);
});
