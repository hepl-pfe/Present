<?php

    namespace App\Http\Controllers\Www;

    use Illuminate\Http\Request;

    use App\Http\Requests;
    use App\Http\Controllers\Controller;

    class FileController extends Controller
    {
        public function getCSVExemple()
        {
            return \Response::download(storage_path() . '/app/CSV/exemple/exemple-file.csv', 'fichierExemple.csv', ['Content-Type: text/cvs']);
        }
    }
