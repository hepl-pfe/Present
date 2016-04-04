<?php

    namespace App\Http\Requests;

    use App\Http\Requests\Request;

    class StoreStatutRequest extends Request
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
            return [
                'name' => 'required|unique:statuts|string|max:250|min:2',
                'color'        => ['required','unique:statuts', 'Regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/'],
            ];
        }
    }
