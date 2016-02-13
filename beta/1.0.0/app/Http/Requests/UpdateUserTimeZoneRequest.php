<?php

    namespace App\Http\Requests;

    use App\Http\Requests\Request;

    class UpdateUserTimeZoneRequest extends Request
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
                'defaultSchoolYearBegin' => 'required|date',
                'defaultSchoolYearEnd'   => 'required|date',
                'defaultCoursDuration'   => 'required|numeric|max:60',
                'defaultDayBegin'        => ['required', 'Regex:/^(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/'],
                'defaultDayEnd'          => ['required', 'Regex:/^(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/'],
            ];
        }
    }
