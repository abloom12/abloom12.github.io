// require gulp
const gulp = require('gulp');
// require gulp devDependencies
const $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});

// init browser-sync server
gulp.task('browser-sync', () => {
  browserSync.init({
    server: './build',
    open: true
  });
});
// delete build folder
gulp.task('clean', () => {
	return $.del('build').then(paths => {
    console.log(paths.join('\n'), 'Have Been Deleted Successfully');
	});
});

/* ---------- Development ---------- */

// copy html to build
gulp.task('html', () => {
  return gulp.src('index.html', { base: 'src'})
        .pipe(gulp.dest('build'));
});
// compile scss, autoprefix, beautify
gulp.task('scss', () => {
  return gulp.src('scss/styles.scss')
          .pipe($.plumber())
          .pipe($.sourcemaps.init())
          .pipe($.sass())
          .pipe($.autoprefixer())
          .pipe($.sourcemaps.write('./'))
          .pipe($.cssbeautify())
          .pipe(gulp.dest('build/assets/css'))
          .pipe($.browserSync.stream());
});
gulp.task('build', ['scss', 'html']);
// watch for changes to src files, update browser
gulp.task('watch', ['build', 'browser-sync'], () => {
	gulp.watch('scss/**/*.scss', ['scss']);
  gulp.watch('index.html', ['html']).on('change', $.browserSync.reload);
});
/* ---------- End Development ---------- */

/* ---------- Production ---------- */

// minify css
gulp.task('css', ['scss'], () => {
  return gulp.src('build/assets/styles.css')
          .pipe($.plumber())
          .pipe($.cleanCss())
          .pipe(gulp.dest('assets/css'))
});
