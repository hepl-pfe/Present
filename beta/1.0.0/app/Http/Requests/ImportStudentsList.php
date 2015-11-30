<?php

namespace App\Http\Requests;
use Maatwebsite\Excel\Files\ExcelFile;
use App\Http\Requests\Request;

class ImportStudentsList extends ExcelFile
{
    public function getFile()
    {
        // Import a user provided file
        return \Input::file('csv');
    }
    public function getFilters()
    {
        // TODO: check if email is unique

        return [
            'chunk'
        ];
    }
}
