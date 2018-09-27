const gulp = require('gulp');

const $ = require('gulp-load-plugins')({
  pattern: ['*'],
  scope: ['devDependencies']
});

//const bs = $.browsersync.create();

gulp.task('scss', () => {
  const plugins = [
    $.autoprefixer(),
    $.cssnano()
  ];
  return gulp.src('src/scss/styles.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass())
    .pipe($.postcss(plugins))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', () => {
  gulp.watch('src/scss/**/*.scss', ['scss']);
});