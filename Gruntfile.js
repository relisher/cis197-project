module.exports = function (grunt) {
  var cwd = process.cwd();
  process.chdir(require('path').join(process.env.NODE_PATH, '..'));
  grunt.loadNpmTasks('gruntify-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-shell');
  process.chdir(cwd);

  var bruce_files = [
    '.babelrc',
    'package.json',
    'webpack.config.js',
    'gulpfile.js',
    '.eslintrc',
    'tests',
    'Gruntfile.js',
    '.babelrc',
  ];

  grunt.initConfig({
    shell: {
      bruce_zip: {
        command: 'zip -r bruce.zip ' + bruce_files.join(' '),
      },
    },
    run: {
      jest_test: {
        options: {
          wait: true
        },
        cmd: 'npm',
        args: [ 'run', 'jest' ]
      }
    },
    mochaTest: {
      test: {
        options: {
          clearRequireCache: true,
        },
        src: ['tests/modelTests.js'],
      },
      test2: {
        options: {
          clearRequireCache: true,
        },
        src: ['tests/serverTests.js'],
      },
    },
    eslint: {
      options: {
        format: 'compact',
      },
      src: [],
    },
    
  });
  grunt.registerTask('default', ['run:jest_test']);
  grunt.registerTask('bruce', ['shell:bruce_zip']);
};
