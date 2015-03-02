'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var changeCase = require('change-case');

function libraryNameToFileName(libraryName) {
    return changeCase.paramCase(libraryName);
}

module.exports = yeoman.generators.Base.extend({
    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);
    },

    initializing: function () {
        this.pkg = require('../package.json');
    },

    prompting: function () {
        var done = this.async();

        this.log(yosay(
            'Welcome to the supreme ' + chalk.red('JsLib') + ' generator!'
        ));

        var prompts = [
            {
                type: 'String',
                name: 'libraryName',
                message: 'Your library name',
                default: path.basename(process.cwd())
            },
            {
                type: 'String',
                name: 'authorName',
                message: 'What\'s your full name',
                store: true
            },
            {
                type: 'String',
                name: 'repoAccount',
                message: 'What\'s your Github username',
                store: true
            },
            {
                type: 'String',
                name: 'testFramework',
                message: 'Choose test framework. mocha/jasmine',
                default: 'jasmine',
                store: true
            }
        ];

        this.prompt(prompts, function (props) {
            this.libraryName = this._.slugify(this._.humanize(props.libraryName));
            this.authorName = props.authorName;
            this.repoAccount = props.repoAccount;
            this.testFramework = props.testFramework;

            done();
        }.bind(this));
    },

    writing: {
        library: function () {
            var exportsName = this._.camelize(this.libraryName);
            this.fs.copyTpl(
                this.templatePath('src/index.js'),
                this.destinationPath('src/' + this.libraryName + '.js'),
                {
                    exportsName: exportsName
                }
            );

            this.fs.copyTpl(
                this.templatePath('test/index.spec.js'),
                this.destinationPath('test/' + this.libraryName + '.spec.js'),
                {
                    libraryName: this.libraryName
                }
            );
        },

        packageFile: function() {
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json'),
                {
                    libraryName: this.libraryName,
                    authorName: this.authorName,
                    repoAccount: this.repoAccount
                }
            );
        },

        bowerFile: function() {
            this.fs.copyTpl(
                this.templatePath('_bower.json'),
                this.destinationPath('bower.json'),
                {
                    libraryName: this.libraryName,
                    authorName: this.authorName
                }
            );
        },

        gruntFile: function() {
            this.fs.copy(
                this.templatePath('_Gruntfile.js'),
                this.destinationPath('Gruntfile.js')
            );
        },

        editorconfigFile: function() {
            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );
        },

        jshintFile: function() {
            this.fs.copy(
                this.templatePath('jshintrc'),
                this.destinationPath('.jshintrc')
            );
            this.fs.copyTpl(
                this.templatePath('test/jshintrc'),
                this.destinationPath('test/.jshintrc'),
                {
                    testFramework: this.testFramework
                }
            );
        },

        gitignoreFile: function() {
            this.fs.copy(
                this.templatePath('gitignore'),
                this.destinationPath('.gitignore')
            );
        },

        readmeFile: function() {
            var displayName = this._.titleize(this.libraryName.replace("-", " "));
            this.fs.copyTpl(
                this.templatePath('_README.md'),
                this.destinationPath('README.md'),
                {
                    libraryName: displayName,
                    authorName: this.authorName
                }
            );
        },

        licenseFile: function() {
            this.fs.copyTpl(
                this.templatePath('_LICENSE'),
                this.destinationPath('LICENSE'),
                {
                    authorName: this.authorName
                }
            );
        },

        travisFile: function() {
            this.fs.copy(
                this.templatePath('travis.yml'),
                this.destinationPath('.travis.yml')
            );
        }
    },

    install: function () {
        this.composeWith('karma', {
            options: {
                'test-framework': this.testFramework,
                'skip-install': this.options['skip-install'],
                'base-path' : '../',
                'app-files' : 'src/**/*.js',
                'test-files' : 'test/**/*.spec.js'
            }
        });

        this.installDependencies({
            skipInstall: this.options['skip-install']
        });
    }
});
