import gulp from 'gulp';
import sourceMaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import esdoc from 'gulp-esdoc';
import plumber from 'gulp-plumber';
import newer from 'gulp-newer';
import connect from 'gulp-connect';
import fs from 'fs';
import path from 'path';
import del from 'del';

const paths = {
  es6Path: './src/**/*.*',
  es6: [ './src/**/*.js', '!./src/**/*.json' ],
  es5: './dist',
  // Must be absolute or relative to source map
  sourceRoot: path.join( __dirname, 'src' )
};

gulp.task( 'clean:dist', () => {
  return del( [
    './dist/**/*'
  ] );
} );

gulp.task( 'build', [ 'clean:dist', 'copy:nonJs' ], () => {
  return gulp.src( paths.es6 )
    .pipe( sourceMaps.init() )
    .pipe( babel( {
      presets: [ 'es2015', 'stage-0', 'react' ]
    } ) )
    .pipe( sourceMaps.write( '.', { sourceRoot: paths.sourceRoot } ) )
    .pipe( gulp.dest( paths.es5 ) );
} );

// Copy all the non JavaScript files to the ./dist folder
gulp.task( 'copy:nonJs', () => {

  return gulp.src( [ paths.es6Path, '!' + paths.es6 ] )
    .pipe( gulp.dest( paths.es5 ) )

} );

gulp.task( 'watch', [ 'build' ], () => {
  gulp.watch( paths.es6, [ 'build' ] );
} );

function getESDocConfig() {
  let esdocConfigPath = path.join(process.cwd(), '.esdoc.json'), data, esdocConfig;
  if (fs.existsSync(esdocConfigPath)) {
    data = fs.readFileSync(esdocConfigPath, { encoding: 'utf8' });
    esdocConfig = !data ? {} : JSON.parse(data);
    console.log('Found ESDoc config in .esdoc.json!');
  } else {
    esdocConfig  = {};
  }
  return esdocConfig;
}
// heavily inspired by https://gist.github.com/psyrendust/37844bd8e0f2dea0c8ea
gulp.task('docs', () => {
  const esdocConfig = getESDocConfig();

  return gulp.src(paths.es6)
    .pipe(plumber())
    .pipe(newer(esdocConfig.destination))
    .pipe(esdoc(esdocConfig));
});

gulp.task('docs:watch', () => {
  const esdocConfig = getESDocConfig();

  gulp.watch(paths.es6, ['docs']);
  // .on('change', evt => console.log('Watching', evt, 'docs'))

  const name = 'Docs server';
  const port = 4001;
  const root = esdocConfig.destination;
  const uri = 'http://localhost:' + port;
  connect.server({
    name,
    port,
    root
  })
});

gulp.task( 'default', [ 'watch' ] );
