/*jshint node:true */

"use strict";

var async = require('async');
var rimraf = require('rimraf');
var exec = require('child_process').exec;


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

module.exports = {
	cleanUnversioned: cleanUnversioned,
	cleanVersioned: cleanVersioned,
	setOpts : setOpts
};
