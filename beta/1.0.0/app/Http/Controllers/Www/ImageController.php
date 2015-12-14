<?php

    namespace App\Http\Controllers\Www;

    use Illuminate\Http\Request;

    use App\Http\Requests;
    use App\Http\Controllers\Controller;

    class ImageController extends Controller
    {
        public function getImage($imagePath, $imageName)
        {
            return \Image::make(storage_path() . '/app/' . $imagePath . '/' . $imageName)->response();
        }
    }
