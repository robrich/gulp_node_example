/*jshint node:true */

"use strict";

var fsExtra = require('fs.extra');


var opts;

var setOpts = function (o) {
	opts = o;
};

var copyToDeployLocation = function (cb) {
	fsExtra.copyRecursive('./dist/', opts.deployLocation, cb);
};

// !!!!!!
var tagGit = function (cb) {
	cb("write this");
};

module.exports = {
	copyToDeployLocation: copyToDeployLocation,
	tagGit: tagGit,
	setOpts: setOpts
};
