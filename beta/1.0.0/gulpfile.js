var elixir = require( 'laravel-elixir' );


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
elixir.config.sourcemaps = true;
elixir( function ( mix ) {
    mix.rubySass('app.scss')
    //mix.version('css/app.css');
    mix.browserSync(
        {
            proxy: "localhost:8888"
        }
    );
} );
