/*jshint node:true */

"use strict";

var es = require('event-stream');

module.exports = function(mess){
	return es.map(function (file, cb){
		if (mess) {
			console.log(mess.replace(/\$file/g, file.path));
		}
		return cb(null, file);
	});
};
