<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <link href='https://fonts.googleapis.com/css?family=Fira+Sans:700,400italic,400,300,300italic' rel='stylesheet'
          type='text/css'>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <meta name="theme-color" content="#0935ff">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="apple-touch-icon" sizes="57x57" href="{{ asset('favicons') }}/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="{{ asset('favicons') }}/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="{{ asset('favicons') }}/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="{{ asset('favicons') }}/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="{{ asset('favicons') }}/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="{{ asset('favicons') }}/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="{{ asset('favicons') }}/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="{{ asset('favicons') }}/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('favicons') }}/apple-touch-icon-180x180.png">
    <link rel="icon" type="image/png" href="{{ asset('favicons') }}/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="{{ asset('favicons') }}/favicon-194x194.png" sizes="194x194">
    <link rel="icon" type="image/png" href="{{ asset('favicons') }}/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="{{ asset('favicons') }}/android-chrome-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="{{ asset('favicons') }}/favicon-16x16.png" sizes="16x16">
    <link rel="manifest" href="{{ asset('favicons') }}/manifest.json">
    <link rel="mask-icon" href="{{ asset('favicons') }}/safari-pinned-tab.svg" color="#0935ff">
    <link rel="shortcut icon" href="{{ asset('favicons') }}/favicon.ico">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="msapplication-TileImage" content="{{ asset('favicons') }}/mstile-144x144.png">
    <meta name="msapplication-config" content="{{ asset('favicons') }}/browserconfig.xml">
    <title>Présent - @yield('title')</title>
</head>
<body>
@if(file_exists(public_path() . '/svg/svg/svg-defs.svg'))
    <?php include(public_path() . '/svg/svg/svg-defs.svg'); ?>
@endif
@yield('content')
<script src="{!! asset('./js/all.js') !!}" type="application/javascript"></script>
</body>
</html>