<?php

    return [

        /*
        |--------------------------------------------------------------------------
        | Third Party Services
        |--------------------------------------------------------------------------
        |
        | This file is for storing the credentials for third party services such
        | as Stripe, Mailgun, Mandrill, and others. This file provides a sane
        | default location for this type of information, allowing packages
        | to have a conventional place to find your various credentials.
        |
        */

        'mailgun' => [
            'domain' => env('MAILGUN_DOMAIN'),
            'secret' => env('MAILGUN_SECRET'),
        ],

        'mandrill' => [
            'secret' => env('MANDRILL_SECRET'),
        ],

        'ses' => [
            'key'    => env('SES_KEY'),
            'secret' => env('SES_SECRET'),
            'region' => 'us-east-1',
        ],

        'stripe' => [
            'model'  => App\User::class,
            'key'    => env('STRIPE_KEY'),
            'secret' => env('STRIPE_SECRET'),
        ],
        'github' => [
            'client_id'     => '4d8fd2c042eff34a2053',
            'client_secret' => 'f92931e5f88dd0fb7031e9d7bcbcdcfa16f715ff',
            'redirect'      => 'http://localhost:8888/login',
        ],

    ];
