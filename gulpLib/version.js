/*jshint node:true */

"use strict";

var exec = require('child_process').exec;


var opts;

var setOpts = function (o) {
	opts = o;
};

var getGitHash = function (cb) {
	exec('git log -1 --format=%h', function (error, stdout, stderr) {
		if (stderr) {
			console.log(stderr);
		}
		if (stdout) {
			stdout = stdout.trim(); // Trim trailing cr-lf
		}
		if (error) {
			console.log('git errored with exit code '+error.code);
			return cb(error);
		}
		if (!stdout) {
			return cb(new Error('git log retured no results'));
		}
		opts.gitHash = stdout;
		console.log("gitHash: '" + opts.gitHash + "'");
		cb(null, opts.gitHash);
	});
};

// !!!!!
var getGitBranch = function (cb) {

	cb('write this');
};

module.exports = {
	getGitHash: getGitHash,
	getGitBranch: getGitBranch,
	setOpts: setOpts
};
