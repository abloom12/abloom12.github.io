const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const shell = require('gulp-shell');
const addsrc = require('gulp-add-src');

// SCSS
const sass = require('gulp-sass');

// PostCSS
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
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
const themeName = 'gspia';
const dest = `../`;

// Compile SCSS files to CSS
gulp.task('scss', function() {
    const processors = [
        autoprefixer,
        cssnano,
        calc
    ];
    gulp.src('src/css/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(rename('pitt.main.css'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(dest + 'css/'))
        .pipe(browserSync.stream());
});

// Template changes
gulp.task('twig', ['refreshCache'], function() {
    console.info('Twig file updated, refreshing cache.');
    browserSync.reload();
});

gulp.task('refreshCache', shell.task(['lando drush cc render']));

gulp.task('js', ['refreshCache'], function () {
    gulp.src('./src/js/main.js')
        .pipe(rollup({
            plugins: [
                resolve({
                    preferBuiltins: false
                }),
                commonjs(),
                rootImport({
                    root: `${__dirname}/src/js`,
                    useEntry: 'prepend',
                    extensions: '.js'
                }),
                alias({
                    '@vue': 'node_modules/vue/dist/vue.esm.js',
                    'lazuli-js': 'node_modules/@jbreneman/lazuli-js/dist/lazuli.esm.js'
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
            ]}, {
                format: 'iife'
            })
        ).on('error', function (e) {
            console.log(e);
            this.emit('end');
        })
        .pipe(rename('pitt.main.js'))
        .pipe(gulp.dest(dest + 'js/'))
        .pipe(browserSync.stream());
});

gulp.task("watch", ["scss", "js"], function() {
    browserSync.init({
        proxy: 'http://' + themeName + '.lndo.site',
        open: false,
        notify: true,
        reloadOnRestart: true,
        scrollThrottle: 150
    });
    gulp.watch("src/css/**/*.scss", ["scss"]);
    gulp.watch("src/js/**/*", ["js"]);
    gulp.watch('../templates/**/*.twig', ['twig']);
});

// gulp.task('default', ['scss', 'js']);
gulp.task('default', ['watch']);