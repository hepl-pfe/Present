<?php

    namespace App\Http\Controllers\Auth;

    use App\Statut;
    use App\User;
    use Validator;
    use App\Http\Controllers\Controller;
    use Illuminate\Foundation\Auth\ThrottlesLogins;
    use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;

    class AuthController extends Controller
    {
        /*
        |--------------------------------------------------------------------------
        | Registration & Login Controller
        |--------------------------------------------------------------------------
        |
        | This controller handles the registration of new users, as well as the
        | authentication of existing users. By default, this controller uses
        | a simple trait to add these behaviors. Why don't you explore it?
        |
        */

        use AuthenticatesAndRegistersUsers, ThrottlesLogins;

        protected $redirectTo = '/';

        /**
         * Create a new authentication controller instance.
         *
         * @return void
         */
        public function __construct()
        {
            $this->middleware('guest', ['except' => 'getLogout']);
        }

        /**
         * Get a validator for an incoming registration request.
         *
         * @param  array $data
         *
         * @return \Illuminate\Contracts\Validation\Validator
         */
        protected function validator(array $data)
        {
            return Validator::make($data, [
                'name'     => 'required|max:255',
                'email'    => 'required|email|max:255|unique:users',
                'password' => 'required|min:6'
            ]);
        }

        /**
         * Create a new user instance after a valid registration.
         *
         * @param  array $data
         *
         * @return User
         */
        protected function create(array $data)
        {
            $user = User::create([
                'name'     => $data['name'],
                'email'    => $data['email'],
                'password' => bcrypt($data['password'])
            ]);
            $user->statuts()->create([
                'name'       => 'Présent',
                'color'      => '#2FC85A',
                'is_default' => 1,
            ]);
            $user->statuts()->create([
                'name'       => 'Absent',
                'color'      => '#E34A78',
                'is_default' => 0
            ]);
            $user->statuts()->create([
                'name'       => 'Retard justifié',
                'color'      => '#0933FF',
                'is_default' => 0
            ]);

            return $user;
        }
        /**
         * Handle an authentication attempt.
         *
         * @return Response
         */

    }
