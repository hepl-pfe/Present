var elixir  = require( 'laravel-elixir' ),
    htmlmin = require( 'gulp-htmlmin' ),
    gulp    = require( 'gulp' );
require( 'laravel-elixir-html-minify' );
//require('laravel-elixir-svg-sprite');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

gulp.task( 'compress', function () {
    var opts = {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        minifyJS: true
    };
    return gulp.src( './storage/framework/views/**/*' )
        .pipe( htmlmin( opts ) )
        .pipe( gulp.dest( './storage/framework/views/' ) );
} );

elixir.config.sourcemaps = true;
elixir( function ( mix ) {
    //mix.svgSprite();
    mix.rubySass( 'app.scss' );
    mix.task( 'compress', 'resources/views/**/*.php' );
    mix.browserSync(
        {
            proxy: "localhost:8888"
        }
    );
} );



