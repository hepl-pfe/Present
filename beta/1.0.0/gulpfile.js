var elixir               = require( 'laravel-elixir' ),
    htmlmin              = require( 'gulp-htmlmin' ),
    gulp                 = require( 'gulp' ),
    svgSprite            = require( 'gulp-svg-sprite' );

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
gulp.task( 'svg', function () {
    config = {
        shape: {
            dimension: {
                maxWidth: 32,
                maxHeight: 32
            },
            spacing: {
                padding: 10
            }
        },
        mode: {
            view: {
                bust: false,
                render: {
                    scss: true
                }
            },
            symbol: true
        }
    };
    gulp.src( '**/*.svg', { cwd: './resources/svg/' } )
        .pipe( svgSprite( config ) )
        .pipe( gulp.dest( './public/svg' ) );
} );
elixir.config.sourcemaps = true;
elixir( function ( mix ) {
    //mix.svgSprite();
    mix.rubySass( 'app.scss' );
    mix.task( 'compress', 'resources/views/**/*.php' );
    //mix.phpUnit().phpSpec();
    mix.browserSync(
        {
            proxy: "localhost:8888"
        }
    );
} );



