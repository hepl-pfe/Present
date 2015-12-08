<?php

    namespace App\Http\Requests;

    use App\Http\Requests\Request;

    class storeFullPlanification extends Request
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
                'school_id' => 'numeric',
                'classe_id' => 'required|numeric',
                'cour_id'   => 'required|numeric',
                'from'      => 'required',
                'to'        => 'required',
                'day'       => 'required',
                'from_hour' => ['required', 'Regex:/^(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/'],
                'to_hour' => ['required', 'Regex:/^(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/']
            ];
        }
    }
