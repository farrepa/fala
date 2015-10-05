/* jshint node: true */

var gulp = require('gulp');
var gutil = require("gulp-util");
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('webpack');
var browserSync = require('browser-sync').create();

var importPaths = require('mojular-govuk-elements').getPaths();

var paths = {
  src: 'fala/assets-src/',
  dest: 'fala/assets/',
  styles: 'fala/assets-src/sass/**/*.scss',
  scripts: 'fala/assets-src/scripts/**/*.js',
  images: 'node_modules/mojular-govuk-elements/assets/images/*'
};

gulp.task('sass', function() {
  return gulp.src(paths.styles)
    .pipe(sourcemaps.init())
    .pipe(sass({ includePaths: importPaths.sass }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dest + 'css/'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('scripts', function(callback) {
  webpack(require('./webpack.config.js')).run(function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      modules: false,
      chunkModules: false
    }));
    callback();
  });
});

gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(gulp.dest(paths.dest + 'images/'));
});

gulp.task('serve', ['build'], function() {
  browserSync.init({
    proxy: 'localhost:8000',
    open: false,
    port: 3000
  });

  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.styles, ['sass']);
  gulp.watch(paths.scripts, ['scripts']).on('change', browserSync.reload);
});

gulp.task('build', ['sass', 'images', 'scripts']);

gulp.task('default', ['build']);
