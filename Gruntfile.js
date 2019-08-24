/**
 * Project Grunt Directives
 *
 * @package     BEM Boilerplate
 * @version     1.0.0
 */

module.exports = function (grunt) {

    'use strict';

    var today = new Date();
    var year = today.getFullYear();

    var sass = require('node-sass');

    // @Grunt: Get our configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /**
         * Validate files with JSHint
         * @link: https://github.com/gruntjs/grunt-contrib-jshint
         */
        jshint: {
            all: [
                'Gruntfile.js',
                'src/assets/js/app.js',
            ]
        },

        /**
         * Concatenate & Minify Javascript files
         * @link: https://github.com/gruntjs/grunt-contrib-uglify
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
         * @link: https://github.com/sindresorhus/grunt-sass/
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
         * @link: https://github.com/nDmitry/grunt-postcss
         */
        postcss: {
            options: {
                map: false,
                processors: [
					require('autoprefixer')
                ]
            },
            dist: {
                src: 'dist/assets/css/app.css'
            }
        },

        /**
         * Minify Stylehseets for production
         * @link: https://github.com/gruntjs/grunt-contrib-cssmin
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
         * Minify Images.
         * @link: https://github.com/gruntjs/grunt-contrib-imagemin
         */
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'dist/assets/images/'
                }]
            }
        },


        /**
         * Clean the arena
         * @link: https://github.com/gruntjs/grunt-contrib-clean
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
         * @link: https://www.npmjs.com/package/grunt-version
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
         * @link: https://github.com/gruntjs/grunt-contrib-compress
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
         * @link: https://github.com/gruntjs/grunt-contrib-copy
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
         * @link: https://github.com/gruntjs/grunt-contrib-watch
         */
        watch: {
            livereload: {
                options: { livereload: true },
                files: ['index.html'],
            },
            js: {
                files: [
                    'src/assets/js/app.js',
                ],
                tasks: ['uglify']
            },
            css: {
                files: ['src/assets/sass/**/*.scss'],
                tasks: ['sass', 'postcss']
            }
        }

    });


    // @Grunt: we're using the following plugins
    require('load-grunt-tasks')(grunt);


    // @Grunt: do the following when we will type 'grunt <command>'
    grunt.registerTask('default', ['jshint', 'uglify', 'sass', 'postcss', 'cssmin', 'watch']);

    grunt.registerTask('development', ['jshint', 'sass', 'postcss', 'imagemin', 'uglify']);
    grunt.registerTask('dev', ['development']); //alias
    grunt.registerTask('production', ['jshint', 'uglify', 'sass', 'postcss', 'cssmin', 'imagemin']);

    grunt.registerTask('release', ['clean', 'production', 'copy', 'compress']);
    grunt.registerTask('release_patch', ['version::patch', 'release']);
    grunt.registerTask('release_minor', ['version::minor', 'release']);
    grunt.registerTask('release_major', ['version::major', 'release']);

};
