/*jshint node:true */

"use strict";

var gulp = require('gulp');

var clean = require('./gulpLib/clean');
var version = require('./gulpLib/version');
var test = require('./gulpLib/test');
var build = require('./gulpLib/build');
var deploy = require('./gulpLib/deploy');


var opts = {
	buildVersion: require('./package.json').version,
	buildNumber: process.env.BUILD_NUMBER,
	copyrightHeader: 'Copyright {{year}} MyCompany, All Rights Reserved',
	deployLocation: './deployDir',
	verbose: true
};
opts.headerText = '/*! {{copyrightHeader}}\r\n   Hash: {{gitHash}}\r\n   Version: {{buildVersion}}\r\n   Branch: {{gitBranch}}\r\n   Build: {{buildNumber}}\r\n   Build date: {{now}} */';
opts.doDeploy = !!process.env.BUILD_NUMBER; // FRAGILE: ASSUME: If we have no build number we're not on the CI server
gulp.env.silent = !opts.verbose;

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


// stop the build on a task failure
gulp.on('err', function (e) {
	console.log();
	console.log('Gulp build failed: '+e.message);
	process.exit(1);
});


var noop = function () {};


// default task gets called when you run `gulp` with no arguments
gulp.task('default', ['clean', 'version', 'test', 'build', 'deploy'], noop);

// The main 5 steps:
gulp.task('clean', ['cleanVersioned', 'cleanUnversioned', 'cleanNodeModules'], noop);
gulp.task('version', ['getGitHash', 'getGitBranch'], noop);
gulp.task('test', ['clean', 'runJSHint', 'runMocha'], noop);
gulp.task('build', ['clean','test','minifyJavaScript', 'copyContentToDist', 'copyModulesToDist', 'shrinkwrapDist', 'setGitInPackageJson'], noop);
gulp.task('deploy', ['test','build', 'copyToDeployLocation', 'tagGit'], noop);

// clean

gulp.task('cleanUnversioned', ['setOpts'], clean.cleanUnversioned);
gulp.task('cleanVersioned', ['setOpts'], clean.cleanVersioned);
gulp.task('cleanNodeModules', clean.cleanNodeModules);

// version

gulp.task('getGitHash', ['setOpts'], version.getGitHash);
gulp.task('getGitBranch', ['setOpts'], version.getGitBranch);

// test

gulp.task('runJSHint', ['setOpts', 'clean'], test.runJSHint);
gulp.task('runMocha', ['clean'], test.runMocha);
gulp.task('runNpmTest', ['clean'], test.runNpmTest); // FRAGILE: This can get recursive

// build

gulp.task('minifyJavaScript', ['clean', 'version', 'setOpts'], build.minifyJavaScript);
gulp.task('copyContentToDist', ['clean', 'setOpts'], build.copyContentToDist);
gulp.task('copyModulesToDist', ['clean', 'setOpts'], build.copyModulesToDist);
gulp.task('shrinkwrapDist', ['clean', 'setOpts', 'copyModulesToDist', 'copyContentToDist'], build.shrinkwrapDist);
gulp.task('setGitInPackageJson', ['clean', 'version', 'setOpts'], build.setGitInPackageJson);

// deploy

gulp.task('copyToDeployLocation', ['setOpts','test','build'], deploy.copyToDeployLocation);
gulp.task('tagGit', ['setOpts', 'test','build'], deploy.tagGit);

// generic

gulp.task('setOpts', function () {
	clean.setOpts(opts);
	version.setOpts(opts);
	build.setOpts(opts);
	test.setOpts(opts);
	deploy.setOpts(opts);
});
