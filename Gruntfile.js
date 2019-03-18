/**
 * Project Grunt Directives
 *
 * @package     BEM Boilerplate
 * @version     1.0.0
 */

 module.exports = function(grunt) {

  'use strict';

  var today  = new Date();
  var year   = today.getFullYear();

  var sass = require('node-sass');

  // @Grunt: Get our configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /**
     * Validate files with JSHint
     * @url: https://github.com/gruntjs/grunt-contrib-jshint
     */
    jshint: {
      all: [
        'Gruntfile.js',
        'src/assets/js/app.js',
      ]
    },

    /**
     * Concatenate & Minify Javascript files
     * @url: https://github.com/gruntjs/grunt-contrib-uglify
     */
    uglify: {
      public: {
        options: {
          sourceMap: false,
          preserveComments: /^!/ // Preserve comments that start with a bang.
        },
        files: {
          'dist/assets/js/app.min.js': [
          	'node_modules/jquery/dist/jquery.min.js',
          	'node_modules/popper.js/dist/umd/popper.min.js',
          	'node_modules/bootstrap/js/dist/util.js',
          	'node_modules/bootstrap/js/dist/tooltip.js',
          	'src/assets/js/app.js'
          ],
        },
      }
    },

    /**
     * Compile SCSS files into CSS
     * @url: https://github.com/sindresorhus/grunt-sass/
     */
    sass: {
	    options: {
			implementation: sass,
			sourceMap: false
	    },
		dist: {
			files: {
				'dist/assets/css/app.css': 'src/assets/sass/app.scss',
			}
		}
    },

    /**
     * Add vendor prefixes
     * @url: https://github.com/nDmitry/grunt-autoprefixer
     */
    autoprefixer: {
      options: {
        cascade: false,
        browsers: ['last 3 versions', 'ie 10']
      },
      projectCSS: {
        src: 'dist/assets/css/app.css'
      }
    },

    /**
     * Minify Stylehseets for production
     * @url: https://github.com/gruntjs/grunt-contrib-cssmin
     */
    cssmin: {
      minify: {
        files: {
          'dist/assets/css/app.css': 'dist/assets/css/app.css'
        },
        options: {
          report: 'min',
          keepSpecialComments: 0
        }
      }
    },


    /**
     * Clean the arena
     * @url: https://github.com/gruntjs/grunt-contrib-clean
     */
    clean: {
      dist: {
        src: [
            './dist',
            './release'
        ]
      }
    },

    /**
     * Versioning dynamically
     * @url: https://www.npmjs.com/package/grunt-version
     */
    version: {
      packageJson: {
        src: [
          'package.json'
        ]
      }
    },


    /**
     * Create a neat zip archive for distribution
     * @url: https://github.com/gruntjs/grunt-contrib-compress
     */
    compress: {
      release: {
        options: {
          archive: './release/<%= pkg.name %>-<%= pkg.version %>.zip',
          mode: 'zip'
        },
        files: [{
          src: [
            '*',
            '**',
            'dist/**',
            '!node_modules/**',
            '!vendor/**',
            '!release/**',
            '!tests/**',
            '!.gitignore',
            '!.travis.yml',
            '!composer.json',
            '!composer.lock',
            '!tmp/**',
            '!logs/**',
            '!readme.md',
            '!contributing.md',
            '!CODE_OF_CONDUCT.md',
            '!*.sublime-grunt.cache',
            '!Gruntfile.js',
            '!package.json',
            '!package-lock.json',
            '!yarn.lock',
            '!phpdoc.xml',
            '!CHANGELOG.txt',
            '!*.sublime-workspace',
            '!*.sublime-project',
            '!<%= pkg.name %>-<%= pkg.version %>.zip'
          ],
          dest: '<%= pkg.name %>/' // archive it in this directory
        }]
      }
    },


    /**
     * Create a fresh copy of release-candidate code
     * @url: https://github.com/gruntjs/grunt-contrib-copy
     */
    copy: {
      release: {
        files: [{
         expand: true,
         src: [
            '*',
            '**',
            'dist/**',
            '!node_modules/**',
            '!vendor/**',
            '!release/**',
            '!tests/**',
            '!.gitignore',
            '!.travis.yml',
            '!composer.json',
            '!composer.lock',
            '!tmp/**',
            '!logs/**',
            '!readme.md',
            '!contributing.md',
            '!CODE_OF_CONDUCT.md',
            '!*.sublime-grunt.cache',
            '!Gruntfile.js',
            '!package.json',
            '!package-lock.json',
            '!phpdoc.xml',
            '!CHANGELOG.txt',
            '!*.sublime-workspace',
            '!*.sublime-project',
            '!<%= pkg.name %>-<%= pkg.version %>.zip'
          ],
          dest: 'release/<%= pkg.name %>-<%= pkg.version %>/',
          flatten: false
        }]
      }
    },


    /**
     * Watch for changes and do it
     * @url: https://github.com/gruntjs/grunt-contrib-watch
     */
    watch: {
      options: {
        livereload: {
          port: 9000
        }
      },
      js: {
        files: [
          'src/assets/js/app.js',
        ],
        tasks: ['uglify']
      },
      css: {
        files: ['src/assets/sass/**/*.scss'],
        tasks: ['sass', 'autoprefixer']
      }
    }

  });


	// @Grunt: we're using the following plugins
	require('load-grunt-tasks')(grunt);


	// @Grunt: do the following when we will type 'grunt <command>'
	grunt.registerTask('default', ['jshint', 'uglify', 'sass', 'autoprefixer', 'cssmin', 'watch']);

	grunt.registerTask('development', ['jshint', 'sass', 'autoprefixer', 'uglify']);
	grunt.registerTask('dev', ['development']); //alias
	grunt.registerTask('production', ['jshint', 'uglify', 'sass', 'autoprefixer', 'cssmin']);

	grunt.registerTask('release', ['clean', 'production', 'copy', 'compress']);
	grunt.registerTask('release_patch', ['version::patch', 'release']);
	grunt.registerTask('release_minor', ['version::minor', 'release']);
	grunt.registerTask('release_major', ['version::major', 'release']);

};
