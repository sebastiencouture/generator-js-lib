'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

var deps = [
    [helpers.createDummyGenerator(), 'karma']
];

describe('js-lib:app', function () {
    before(function (done) {
        helpers.run(path.join(__dirname, '../app'))
            .inDir(path.join(os.tmpdir(), './temp-test'))
            .withOptions({ 'skip-install': true })
            .withGenerators(deps)
            .withPrompt({
                libraryName: "test-lib",
                authorName: "Sebastien Couture",
                repoAccount: "sebastiencouture",
                testFramework: "jasmine"
            })
            .on('end', done);
    });

    it('should create project files', function () {
        assert.file([
            'bower.json',
            'Gruntfile.js',
            'LICENSE',
            'README.md',
            '.gitignore',
            'package.json',
            '.editorconfig',
            '.jshintrc',
            '.travis.yml'
        ]);
    });

    it('should create library files', function() {
        assert.file([
            'src/test-lib.js',
            'test/test-lib.spec.js',
            'test/.jshintrc'
        ]);
    });

    it('should include author name in bower.json', function() {
        assert.fileContent([['bower.json', 'Sebastien Couture']]);
    });

    it('should include author name in LICENSE', function() {
        assert.fileContent([['LICENSE', 'Copyright (c) 2015 Sebastien Couture']]);
    });

    it('should include author name in copyright of README', function() {
        assert.fileContent([['README.md', 'Copyright (c) 2015 Sebastien Couture']]);
    });

    it('should include prettified library name in copyright of README', function() {
        assert.fileContent([['README.md', 'Test Lib']]);
    });

    it('should include author name in package.json', function() {
        assert.fileContent([['package.json', '"author": "Sebastien Couture"']]);
    });

    it('should include library name in package.json', function() {
        assert.fileContent([['package.json', '"name": "test-lib"']]);
    });

    it('should include git url in package.json', function() {
        assert.fileContent([['package.json', '"url": "git://github.com/sebastiencouture/test-lib.git"']]);
    });
});
