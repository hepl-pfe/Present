<?php

    namespace App\Http\Requests;

    use App\Http\Requests\Request;

    class StoreStudentRequest extends Request
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
                'first_name'     => 'required|string|max:250|min:2',
                'last_name'      => 'required|string|max:250|min:2',
                'email_parent_1' => 'required|e-mail|unique',
                'email_parent_2' => 'e-mail|unique',
                'email_eleve_1'  => 'required|e-mail|unique',
                'email_eleve_2'  => 'e-mail|unique',
                'photo'          => ''
            ];
        }
    }
