<?php

namespace App\Http\Controllers\Www;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ImageController extends Controller
{
    public function getImage($imagePath)
    {
        dd('on va afficher cette image',$imagePath);
    }
}
