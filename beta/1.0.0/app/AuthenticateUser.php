<?php
    /**
     * Created by PhpStorm.
     * User: danielschreurs
     * Date: 28/01/16
     * Time: 22:05
     */

    namespace App;

    use App\Repositories\UserRepository as UserRepository;
    use Laravel\Socialite\Contracts\Factory as Socialite;
    use Illuminate\Contracts\Auth\Guard as Authenticator;

    class AuthenticateUser
    {
        /**
         * @var UserRepository
         */
        private $user;
        /**
         * @var Socialite
         */
        private $socialite;
        /**
         * @var AuthenticateUser
         */
        private $auth;

        public function __construct(UserRepository $user, Socialite $socialite, Authenticator $auth)
        {
            $this->user = $user;
            $this->socialite = $socialite;
            $this->auth = $auth;
        }

        public function execute($hasCode)
        {
            if (!$hasCode) {
                return $this->getAuthorizationFirst();
            }
            $user = $this->user->findByUsernameOrCreate($this->getGithubUser());
            $this->auth()->login($user,true);
            return redirect('/');
        }

        /**
         * @return \Laravel\Socialite\Contracts\User
         */
        private function getGithubUser()
        {
            return $this->socialite->driver('github')->user();
        }

        /**
         * @return \Symfony\Component\HttpFoundation\RedirectResponse
         */
        private function getAuthorizationFirst()
        {
            return $this->socialite->driver('github')->redirect();
        }
    }