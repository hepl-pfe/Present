var elixir    = require( 'laravel-elixir' ),
    htmlmin   = require( 'gulp-htmlmin' ),
    gulp      = require( 'gulp' ),
    svgSprite = require( 'gulp-svg-sprite' );

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
    //mix.task( 'compress', 'resources/views/**/*.php' );
    mix.scripts( [
        "vendor/jquery.js",
        "vendor/minified/slimScroll.min.js",
        "vendor/bootstrap_tooltip.min.js",
        'vendor/minified/intro.min.js',
        'vendor/chosen.jquery.js',
        'tools/select.js',
        'tools/chosen.js',
        'tools/tooltip.js',
        'tools/alert-message.js',
        'tools/introduction.js',
        'forms/create_cours.js',
        'forms/login.js',
        'forms/data-form.js',
        'forms/users/load-avatar-file.js',
        'forms/users/load-user-file.js',
        'forms/presents/take-presents.js',
        'graphiques/students/present.js',
        'forms/begin-date.js'
    ] );
    mix.browserSync(
        {
            proxy: "localhost:8888"
        }
    );
} );



