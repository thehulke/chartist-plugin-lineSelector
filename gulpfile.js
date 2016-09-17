const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const browserify = require('gulp-browserify');

gulp.task('babel', () => {
	return gulp.src('app/js/*.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(browserify({
			insertGlobals: true,
			debug: !gulp.env.production
		}))
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(gulp.dest('dist'));
});


gulp.task('sass', function() {
	return gulp.src('app/scss/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('browserSync', function() {
	browserSync.init({
		server: ['app', 'dist'],
	})
})

gulp.task('watch', ['browserSync', 'sass', 'babel'], function() {
	gulp.watch('app/scss/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', ['babel'], browserSync.reload);

})
