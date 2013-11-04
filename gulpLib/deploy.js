/*jshint node:true */

"use strict";

var fsExtra = require('fs.extra');
var exec = require('child_process').exec;


var opts;

var setOpts = function (o) {
	opts = o;
};

var copyToDeployLocation = function (cb) {
	fsExtra.copyRecursive('./dist/', opts.deployLocation, cb);
};

// Not a big fan of altering the version control system during a build, but the customer is always right
var tagGit = function (cb) {
	if (!opts.buildNumber) {
		return cb(null); // successfully did nothing
	}

	exec('git tag -a -f '+opts.buildNumber+' -m '+opts.buildNumber+' && git push origin --tags', function (error, stdout, stderr) {
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
			cb('git tag failed, exit code '+error.code);
		}
		cb(null);
	});
};

module.exports = {
	copyToDeployLocation: copyToDeployLocation,
	tagGit: tagGit,
	setOpts: setOpts
};
