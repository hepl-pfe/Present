<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <link href='https://fonts.googleapis.com/css?family=Lato:400,100,300,900,700,400italic,100italic' rel='stylesheet'
          type='text/css'>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
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