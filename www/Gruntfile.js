module.exports = function(grunt) {
	'use strict';
	
	//
	// Grunt configuration:
	//
	// https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
	//
	grunt.initConfig({
		// Project configuration
		// ---------------------
		// specify an alternate install location for Bower
		bower: {
			dir: 'src/components'
		},
		// Coffee to JS compilation
		coffee: {
			compile: {
				files: {
					'temp/scripts/*.js': 'src/scripts/**/*.coffee'
				},
				options: {
					basePath: 'serc/scripts'
				}
			}
		},
		// compile .scss/.sass to .css using Compass
		compass: {
			dist: {
				// http://compass-style.org/help/tutorials/configuration-reference/#configuration-properties
				options: {
					css_dir: 'temp/styles',
					sass_dir: 'src/styles',
					images_dir: 'src/images',
					javascripts_dir: 'temp/scripts',
					force: true
				}
			}
		},
		// headless testing through PhantomJS
		mocha: {
			all: ['test/**/*.html']
		},
		// default watch configuration
		watch: {
			coffee: {
				files: 'src/scripts/**/*.coffee',
				tasks: 'coffee reload'
			},
			compass: {
				files: ['src/styles/**/*.{scss,sass}'],
				tasks: 'compass reload'
			},
			reload: {
				files: ['src/*.html', 'src/css/**/*.css', 'src/js/**/*.js', 'src/img/**/*'],
				tasks: 'reload'
			}
		},
		// default lint configuration, change this to match your setup:
		// https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
		lint: {
			files: ['Gruntfile.js', 'src/js/**/*.js', 'spec/**/*.js']
		},
		// specifying JSHint options and globals
		// https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#specifying-jshint-options-and-globals
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			},
			globals: {
				jQuery: true
			}
		},
		// Build configuration
		// -------------------
		// the staging directory used during the process
		staging: 'temp',
		// final build output
		output: 'dist',
		mkdirs: {
			staging: 'src/'
		},
		// Below, all paths are relative to the staging directory, which is a copy
		// of the src/ directory. Any .gitignore, .ignore and .buildignore file
		// that might appear in the src/ tree are used to ignore these values
		// during the copy process.
		// usemin handler should point to the file containing
		// the usemin blocks to be parsed
		'usemin-handler': {
			html: ['index.html']
		},
		// renames JS/CSS to prepend a hash of their contents for easier
		// versioning
		rev: {
			js: 'js/**/*.js',
			css: 'css/**/*.css',
			img: ['img/**', '!img/bg/blackey.png'] // doesn't replace css image urls
		},
		// update references in HTML/CSS to revved files
		usemin: {
			html: ['**/*.html'],
			css: ['**/*.css'],
			appcache: ['manifest.appcache']
		},
		// Optimizes JPGs and PNGs (with jpegtran & optipng)
		img: {
			dist: '<config:rev.img>'
		},
		// rjs configuration. You don't necessarily need to specify the typical
		// `path` configuration, the rjs task will parse these values from your
		// main module, using http://requirejs.org/docs/optimization.html#mainConfigFile
		//
		// name / out / mainConfig file should be used. You can let it blank if
		// you're using usemin-handler to parse rjs config from markup (default
		// setup)
		rjs: {
			// no minification, is done by the min task
			optimize: 'none',
			baseUrl: './js',
			wrap: true,
			name: 'main'
		},
		// While Yeoman handles concat/min when using
		// usemin blocks, you can still use them manually
		concat: {},
		// concat css/**/*.css files, inline @import, output a single minified css
		css: {},
		min: {},
		// HTML minification
		html: {
			files: ['**/*.html']
		},
		// generate application cache manifest
		manifest: {},
	});
	// Alias the `test` task to run the `mocha` task instead
	grunt.registerTask('test', 'server:phantom mocha');
	
	// intro clean mkdirs:staging usemin-handler concat css min img rev usemin html manifest copy
	grunt.registerTask('build', 'intro clean mkdirs:staging usemin-handler concat css img rev usemin html copy'); 
};