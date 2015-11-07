<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <link href='https://fonts.googleapis.com/css?family=Lato:400,100,300,900,700,400italic,100italic' rel='stylesheet'
          type='text/css'>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="{!! asset('./js/jquery-2.1.4.min.js') !!}" type="application/javascript"></script>
    <script src="{!! asset('./js/app.js') !!}" type="application/javascript"></script>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <title>Présent - @yield('title')</title>
</head>
<body>
@if(file_exists(public_path() . '/svg/symbol/svg/sprite.symbol.svg'))
    <?php include(public_path() . '/svg/symbol/svg/sprite.symbol.svg'); ?>
@endif
@yield('content')
</body>
</html>