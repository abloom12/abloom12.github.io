const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const shell = require('gulp-shell');
const addsrc = require('gulp-add-src');

// SCSS
const sass = require('gulp-sass');

// PostCSS
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const calc = require('postcss-calc');

// JS
const concat = require('gulp-concat');
const jshint = require('gulp-jshint');
const rename = require('gulp-rename');
const rollup = require('gulp-better-rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const alias = require('rollup-plugin-alias');
const replace = require('rollup-plugin-replace');
const strip = require('rollup-plugin-strip');
const rootImport = require('rollup-plugin-root-import');

// Config
const themeName = 'waynesburg';
const dest = `../`;

// Compile SCSS files to CSS
gulp.task('scss', function () {
  const processors = [
    autoprefixer,
    cssnano,
    calc
  ];

  gulp.src('src/css/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('./maps'))
    .pipe(rename('custom.css'))
    .pipe(gulp.dest(dest + 'css/'))
    .pipe(browserSync.stream());
});

// Compile JS
gulp.task('js', function () {
  gulp.src('./src/js/main.js')
    .pipe(rollup({
      plugins: [
        resolve({
          preferBuiltins: false
        }),
        commonjs({
          namedExports: {
            // left-hand side can be an absolute path, a path
            // relative to the current directory, or the name
            // of a module in node_modules
            'body-scroll-lock': ['disableBodyScroll', 'enableBodyScroll', 'clearAllBodyScrollLocks']
          }
        }),
        rootImport({
          root: `${__dirname}/src/js`,
          useEntry: 'prepend',
          extensions: '.js'
        }),
        alias({
          '@vue': 'node_modules/vue/dist/vue.esm.js',
          'lazuli-js': 'node_modules/@jbreneman/lazuli-js/dist/lazuli.esm.js',
          '@yt': 'node_modules/youtube-video-js/dist/youtube-video-min.js'
        }),
        replace({
          'process.env.NODE_ENV': JSON.stringify('development')
        }),
        babel({
          exclude: 'node_modules/**',
          presets: [['env', {
            modules: false
          }], 'stage-3'],
          babelrc: false,
          plugins: ['external-helpers']
        })
      ]
    }, {
        format: 'iife'
      })
    ).on('error', function (e) {
      console.log(e);
      this.emit('end');
    })
    .pipe(rename('custom.js'))
    .pipe(gulp.dest(dest + 'js/'))
    .pipe(browserSync.stream());
});

// Template changes
gulp.task('twig', ['refreshCache'], function () {
  console.log('Template changed, reloading.');
  browserSync.reload();
});

gulp.task('refreshCache', shell.task(['lando drush cc render']));

// Watch asset folder for changes
gulp.task('watch', ['scss', 'js'], function () {
  browserSync.init({
    proxy: `https://${themeName}.lndo.site/`,
    open: false,
    ghostMode: false
  });

  gulp.watch('src/css/**/*', ['scss']);
  gulp.watch('src/js/**/*', ['js']);
  gulp.watch('../../**/*.twig', ['twig']);
});

// Set watch as default task
gulp.task('default', ['watch']);
