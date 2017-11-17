// require gulp
const gulp = require('gulp');
// require gulp devDependencies
const $ = require('gulp-load-plugins')({
    // pattern: ['*'],
    scope: ['devDependencies']
});
// require devDependencies
const del = require('del');
const browserSync = require('browser-sync').create();

// start a browser-sync server
gulp.task('browser-sync', () => {
  browserSync.init({
    server: './build',
    open: true
  });
});
// compile scss
gulp.task('css', () => {
	return gulp.src('src/scss/styles.scss')
      		.pipe($.plumber())
      		.pipe($.sourcemaps.init())
      		.pipe($.sass())
      		.pipe($.autoprefixer({
      			browsers: ['last 2 versions']
      		}))
      		.pipe(gulp.dest('assets/css'))
      		.pipe($.cleanCss())
      		.pipe($.rename({ suffix: '.min' }))
      		.pipe($.sourcemaps.write('./'))
      		.pipe(gulp.dest('assets/css'))
          .pipe(browserSync.stream());
});
// watch for changes to src files, update browser
gulp.task('watch', ['browser-sync'], () => {
	gulp.watch('src/scss/**/*.scss', ['css']);
  gulp.watch('index.html').on('change', browserSync.reload);
});
