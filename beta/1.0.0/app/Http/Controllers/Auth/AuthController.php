<?php

    namespace App\Http\Controllers\Auth;

    use App\Http\Requests\getLastRegisterFormOrLoginUserRequest;
    use App\Statut;
    use App\User;
    use Laracasts\Flash\Flash;
    use Validator;
    use App\Http\Controllers\Controller;
    use Illuminate\Foundation\Auth\ThrottlesLogins;
    use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
    use Jrean\UserVerification\Traits\VerifiesUsers;
    use Jrean\UserVerification\Facades\UserVerification;
    use Illuminate\Http\Request;

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
            $this->middleware('guest', ['except' => ['getLogout', 'getLastRegisterFormOrLoginUser']]);
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
                'password' => 'required|min:2',
                'avatar'   => 'url'
            ]);
        }

        /**
         * Create a new user instance after a valid registration.
         *
         * @param  array $data
         *
         * @return User
         */
        public function create(array $data)
        {
            $user = User::create([
                'name'     => $data['name'],
                'email'    => $data['email'],
                'password' => $data['password'],
                'avatar'   => isset($data['avatar']) ? isset($data['avatar']) : ''
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
         * Handle a registration request for the application.
         *
         * @param  \Illuminate\Http\Request $request
         *
         * @return \Illuminate\Http\Response
         */
        public function postRegister(Request $request)
        {
            $validator = $this->validator($request->all());

            if ($validator->fails()) {
                $this->throwValidationException(
                    $request, $validator
                );
            }

            $user = $this->create($request->all());

            \Auth::login($user, true);
            UserVerification::generate($user);

            UserVerification::send($user, 'Présent | Veuillez valider votre adresse e-mail');

            return redirect($this->redirectPath());
        }

        public function getLastRegisterFormOrLoginUser(GetLastRegisterFormOrLoginUserRequest $request)
        {
            if (User::where('email', '=', $request->email)->exists()) {
                return $this->postLogin($request);
            }
            return \View::make('auth.register',["request"=>[$request->email,$request->password]]);
        }

    }
