/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var sample = require('../');
var should = require('should');
require('mocha');

describe('sample tasks', function() {
	describe('sample()', function() {

		it('should return project', function(done) {
			// Arrange

			// Act
			var actual = sample.sample();

			// Assert
			should.exist(actual);
			actual.should.equal('project');
			done();
		});

	});
});
