/*global describe, it*/
"use strict";

var fs = require("fs"),
  es = require("event-stream"),
  should = require("should"),
  sinon = require("sinon"),
  coveralls = require("coveralls");

require("mocha");

delete require.cache[require.resolve("../")];

var Vinyl = require('vinyl'),
  gulpCoveralls = require("../");

describe("gulp-coveralls", function () {

  var convertedFile = 'CONVERTED';

  var expectedFile = new Vinyl({
    path: "test/expected/lcov.info",
    cwd: "test/",
    base: "test/expected",
    contents: fs.readFileSync("test/expected/lcov.info")
  });

  afterEach(function() {
    coveralls.getBaseOptions.restore && coveralls.getBaseOptions.restore();
    coveralls.convertLcovToCoveralls.restore && coveralls.convertLcovToCoveralls.restore();
    coveralls.sendToCoveralls.restore && coveralls.sendToCoveralls.restore();
  });

  describe("when successful", function() {

    beforeEach(function() {
      // ugh...
      sinon.stub(coveralls, "getBaseOptions").callsArgWith(0, null, {});
      sinon.stub(coveralls, "convertLcovToCoveralls").callsArgWith(2, null, convertedFile);
      sinon.stub(coveralls, "sendToCoveralls").callsArgWith(1, null, {}, '');
    });

    it("should pass the file through via buffer", function (done) {

      var srcFile = new Vinyl({
        path: "test/fixtures/lcov.info",
        cwd: "test/",
        base: "test/fixtures",
        contents: fs.readFileSync("test/fixtures/lcov.info")
      });

      var stream = gulpCoveralls();

      stream.on("error", function(err) {
        should.exist(err);
        done(err);
      });

      stream.on("data", function (newFile) {

        should.exist(newFile);
        should.exist(newFile.contents);

        String(newFile.contents).should.equal(String(expectedFile.contents));
        done();
      });

      stream.write(srcFile);
      stream.end();
    });

    it("should send the file contents to Coveralls", function (done) {

      var srcFile = new Vinyl({
        path: "test/fixtures/lcov.info",
        cwd: "test/",
        base: "test/fixtures",
        contents: fs.readFileSync("test/fixtures/lcov.info")
      });

      var stream = gulpCoveralls();
      stream.write(srcFile);
      stream.end();

      stream.on("data", function () {
        // ugh...
        sinon.assert.calledOnce(coveralls.getBaseOptions);
        sinon.assert.calledWith(coveralls.getBaseOptions, sinon.match.func);

        sinon.assert.calledOnce(coveralls.convertLcovToCoveralls);
        sinon.assert.calledWith(coveralls.convertLcovToCoveralls, srcFile.contents.toString(), { filepath: '.' }, sinon.match.func);

        sinon.assert.calledOnce(coveralls.sendToCoveralls);
        sinon.assert.calledWith(coveralls.sendToCoveralls, convertedFile, sinon.match.func);
        done();
      });
    });

  });

  describe("when Coveralls responds with an error", function() {

    beforeEach(function() {
      // ugh...
      sinon.stub(coveralls, "getBaseOptions").callsArgWith(0, null, {});
      sinon.stub(coveralls, "convertLcovToCoveralls").callsArgWith(2, null, convertedFile);
      sinon.stub(coveralls, "sendToCoveralls").callsArgWith(1, null, { statusCode: 404 }, 'Blah blah blah');
    });

    it("should emit an error", function (done) {

      var srcFile = new Vinyl({
        path: "test/fixtures/lcov.info",
        cwd: "test/",
        base: "test/fixtures",
        contents: fs.readFileSync("test/fixtures/lcov.info")
      });

      var stream = gulpCoveralls();

      stream.on("error", function (error) {
        should.exist(error);
        done();
      });

      stream.write(srcFile);
      stream.end();

    });

  });

  describe("nulls", function() {

    beforeEach(function() {
      // ugh...
      sinon.stub(coveralls, "getBaseOptions");
      sinon.stub(coveralls, "convertLcovToCoveralls");
      sinon.stub(coveralls, "sendToCoveralls");
    });

    it("should pass the file through when null", function(done) {
      var nullFile = new Vinyl();

      var stream = gulpCoveralls();

      stream.on("data", function (newFile) {
        should.exist(newFile);
        sinon.assert.notCalled(coveralls.getBaseOptions);
        sinon.assert.notCalled(coveralls.convertLcovToCoveralls);
        sinon.assert.notCalled(coveralls.sendToCoveralls);
        done();
      });

      stream.write(nullFile);
      stream.end();
    });

  });

  describe("streams", function() {

    it("should error on stream", function (done) {

      var srcFile = new Vinyl({
        path: "test/fixtures/lcov.info",
        cwd: "test/",
        base: "test/fixtures",
        contents: fs.createReadStream("test/fixtures/lcov.info")
      });

      var stream = gulpCoveralls();

      stream.on("error", function(err) {
        should.exist(err);
        done();
      });

      stream.on("data", function (newFile) {
        newFile.contents.pipe(es.wait(function(err, data) {
          done(err);
        }));
      });

      stream.write(srcFile);
      stream.end();
    });

  });

});
