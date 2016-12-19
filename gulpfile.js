
process.env.PORT = process.env.PORT || 8080;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const del = require('del');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins();

const srcFolder = 'src';
const outFolder = 'build';

const configFile = () => `config/${process.env.NODE_ENV}.js`;

gulp.task('clean', () => del(`${outFolder}`, { force: true }));

gulp.task('config', () => {
  return gulp.src(`${configFile()}`)
    .pipe($.rename('config.js'))
    .pipe(gulp.dest(`${srcFolder}/scripts/config`))
});

gulp.task('dev:js', ['config'], () => {
  return gulp.src([`${srcFolder}/scripts/**/*.js`])
    .pipe($.sourcemaps.init())
      .pipe($.babel({ presets: ['es2015'] }))
      .pipe($.concat('main.js'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(`${outFolder}/scripts`))
    .pipe($.livereload());
});

gulp.task('prod:js', ['config'], () => {
  return gulp.src([`${srcFolder}/scripts/**/*.js`])
    .pipe($.babel({ presets: ['es2015'] }))
    .pipe($.concat('main.js'))
    .pipe(gulp.dest(`${outFolder}/scripts`))
    .pipe($.livereload());
});

gulp.task('jade:views', () => {
  return gulp.src([`${srcFolder}/views/**/*.jade`])
    .pipe($.jade())
    .pipe(gulp.dest(`${outFolder}/views`))
    .pipe($.livereload());
});

gulp.task('jade:index', () => {
  return gulp.src([`${srcFolder}/index.jade`])
    .pipe($.wiredep({ includeSelf: true }))
    .pipe($.jade({ pretty: true }))
    .pipe($.usemin({
      css: [$.minifyCss],
      js: [$.uglify]
    }))
    .pipe(gulp.dest(`${outFolder}`))
    .pipe($.livereload());
});

gulp.task('less', () => {
  return gulp.src([`${srcFolder}/styles/style.less`])
    .pipe($.less())
    .pipe(gulp.dest(`${outFolder}/styles`))
    .pipe($.livereload());
});

gulp.task('fonts', () => {
  return gulp.src([`${srcFolder}/fonts/**/*`])
    .pipe(gulp.dest(`${outFolder}/fonts`))
    .pipe($.livereload());
});

gulp.task('images', () => {
  return gulp.src([`${srcFolder}/img/**/*`])
    .pipe(gulp.dest(`${outFolder}/img`))
    .pipe($.livereload());
});

gulp.task('jade', ['jade:index', 'jade:views']);

gulp.task('dev:build',  ['dev:js',  'jade', 'less', 'fonts', 'images']);

gulp.task('prod:build', (done) => {
  runSequence('clean', ['prod:js', 'jade', 'less', 'fonts', 'images'], done);
});

gulp.task('dev:serve', ['dev:build'], () => {
  return gulp.src(`${outFolder}`)
    .pipe($.webserver({
      open: false,
      port: process.env.PORT,
      host: `localhost`,
      livereload: true
    }));
});

gulp.task('dev:watch', () => {
  gulp.watch(`${configFile()}`, ['dev:js']);
  gulp.watch(`${srcFolder}/index.jade`, ['jade:index']);
  gulp.watch(`${srcFolder}/fonts/**/*`, ['fonts']);
  gulp.watch(`${srcFolder}/images/**/*`, ['images']);
  gulp.watch(`${srcFolder}/scripts/**/*.js`, ['dev:js']);
  gulp.watch(`${srcFolder}/styles/**/*.less`, ['less']);
  gulp.watch(`${srcFolder}/views/**/*.jade`, ['jade:views']);
});

gulp.task('prod:serve', () => {
 return gulp.src(`${outFolder}`)
   .pipe($.webserver({
     port: process.env.PORT,
     host: '0.0.0.0'
   }));
});

gulp.task('dev', (done) => {
  process.env.NODE_ENV = 'development';
  runSequence('clean', 'dev:serve', 'dev:watch', done);
});

gulp.task('prod', (done) => {
  process.env.NODE_ENV = 'production';
  runSequence('prod:serve', done);
});

gulp.task('test', (done) => {
  process.env.NODE_ENV = 'test';

  const wiredep = require('wiredep');
  const bower = require('./bower.json').main;
  const Server = require('karma').Server;

  new Server({
    configFile: `${__dirname}/karma.conf.js`,
    action: 'run',
    files: wiredep({ devDependencies: true }).js
      .concat(bower.filter((dep) => /\.js$/.test(dep)))
      .concat([
        'test/context.js',
        'src/scripts/**/*.js',
        'config/test.js',
        'test/**/*.test.js'
      ])
  }, done).start();
});

