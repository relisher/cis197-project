var gulp = require('gulp');
var babelify = require('babelify');
var zip = require('gulp-zip');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');

var ms1_compile = [
  'server/**/*.js',
];

var ms2_compile = [
  'src/**/*.js',
];

gulp.task('ms1-compile', function () {
  return gulp.src(ms1_compile, { base: '.' })
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(gulp.dest('compiled'));
});

gulp.task('ms2-compile', function () {
  return gulp.src(ms2_compile, { base: '.' })
    .pipe(babel({
      presets: ['es2015', 'react'],
    }))
    .pipe(gulp.dest('compiled'));
});

gulp.task('ms1-zip', function () {
  gulp.src(['compiled/**/*.js', ms1_compile[0]], { base: '.' })
    .pipe(zip('files.zip'))
    .pipe(gulp.dest(''));
});

gulp.task('ms2-zip', function () {
  gulp.src(['compiled/**/*.js', ms2_compile[0]], { base: '.' })
    .pipe(zip('files.zip'))
    .pipe(gulp.dest(''));
});

gulp.task('ms1-eslint', function () {
  return gulp.src(ms1_compile)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('ms2-eslint', function () {
  return gulp.src(ms2_compile)
    .pipe(eslint())
    .pipe(eslint.format());
});
