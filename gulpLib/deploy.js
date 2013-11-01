/*jshint node:true */

"use strict";

var fsExtra = require('fs.extra');


var opts;

var setOpts = function (o) {
	opts = o;
};

var copyToDeployLocation = function (cb) {
	fsExtra.copyRecursive('./dist/Web/Web', opts.deployLocation, cb);
};

module.exports = {
	copyToDeployLocation: copyToDeployLocation,
	setOpts: setOpts
};
