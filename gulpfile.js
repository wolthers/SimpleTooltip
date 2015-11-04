'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var sass = require('gulp-sass');
var path = require('path');

gulp.task('less', function () {
	return gulp.src('./src/**/*.less')
	.pipe(less({
		paths: [ path.join(__dirname, 'less') ]
	}))
	.pipe(gulp.dest('./dist'));
});

gulp.task('sass', function () {
	gulp.src('./src/**/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest('./dist'));
});