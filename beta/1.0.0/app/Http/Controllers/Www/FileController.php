<?php

    namespace App\Http\Controllers\Www;

    use Illuminate\Http\Request;

    use App\Http\Requests;
    use App\Http\Controllers\Controller;
    use Symfony\Component\HttpFoundation\File\File;

    class FileController extends Controller
    {
        protected $valideMyme = ['UTF-8 Unicode text, with CRLF line terminators','ASCII text','ASCII text, with CRLF line terminators','ISO-8859 text, with CRLF line terminators'];

        /**
         * @return mixed
         */
        public function getCSVExemple()
        {
            return \Response::download(storage_path() . '/app/CSV/exemple/exemple-file-2.csv', 'fichierExemple.csv', ['Content-Type: text/cvs']);
        }

        /**
         * @return mixed
         */
        public function getXlsExemple()
        {
            return \Response::download(storage_path() . '/app/XLSX/exemple/exemple-file.xls', 'fichierExemple.xls', ['Content-Type: application/vnd.ms-excel']);
        }

        /**
         * @param $file
         *
         * @return bool
         */
        public function isValideExelFile($file)
        {
            return in_array($this->getExtension($file), $this->valideMyme);
        }

        /**
         * Get image mime type
         *
         * @param $file
         *
         * @return mixed
         */
        public function getExtension($file)
        {
            return (finfo_file(finfo_open(PATHINFO_EXTENSION), $file));
        }
    }
