<?php

    namespace App\Http\Requests;

    use App\Http\Requests\Request;

    class ImportValideStudents extends Request
    {
        /**
         * Determine if the user is authorized to make this request.
         *
         * @return bool
         */
        public function authorize()
        {
            return true;
        }

        /**
         * Get the validation rules that apply to the request.
         *
         * @return array
         */
        public function rules()
        {
            $array = [];
            for ($i = 1; $i < $this->nbr; $i++) {
                $array[ 'first_name-' . $i ] = 'required|string|max:250|min:2';
                $array[ 'last_name-' . $i ] = 'required|string|max:250|min:2';
                $array[ 'email-' . $i ] = 'required|e-mail|max:250|unique:students,email,NULL,id,user_id,' . \Auth::user()->id;
            }
            return $array;
        }
    }
