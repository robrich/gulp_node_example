/*jshint node:true */

"use strict";

var async = require('async');
var rimraf = require('rimraf');
var childProcess = require('child_process');
var exec = childProcess.exec;
var spawn = childProcess.spawn;


var opts;

var setOpts = function (o) {
	opts = o;
};

var cleanUnversioned = function (cb) {
	async.parallel([
		function (cba) {
			rimraf('./dist', cba);
		},
		function (cbb) {
			rimraf('./log', cbb);
		}
	], cb);
};

var cleanVersioned = function (cb) {
	// TODO: remove echo once we're done debugging !!!!!
	exec('echo git reset --hard', function (error, stdout, stderr) {
		if (stderr) {
			console.log(stderr);
		}
		if (stdout) {
			stdout = stdout.trim(); // Trim trailing cr-lf
		}
		if (stdout && opts.verbose) {
			console.log(stdout);
		}
		if (error) {
			cb('git reset failed, exit code '+error.code);
		}
		cb(null);
	});
};

var cleanNodeModules = function (cb) {
	var npm = (process.platform === "win32" ? "npm.cmd" : "npm");
	var s = spawn(npm, ['prune'], {stdio: 'inherit'});
	s.on('close', function (err) {
		if (err) {
			return cb('npm prune errored with exit code '+err);
		}
		cb(null);
	});
};

module.exports = {
	cleanUnversioned: cleanUnversioned,
	cleanVersioned: cleanVersioned,
	cleanNodeModules: cleanNodeModules,
	setOpts : setOpts
};
