<?php
    /**
     * Created by PhpStorm.
     * User: danielschreurs
     * Date: 28/01/16
     * Time: 23:09
     */

    namespace app\Repositories;

    use App\User;

    class UserRepository
    {

        /**
         * @param $userData
         *
         * @return static
         */
        public function findByUsernameOrCreate($userData)
        {

            return User::firstOrCreate([
                'name'   => $userData->nickname ? $userData->nickname : $userData->name,
                'email'  => $userData->email,
                'avatar' => $userData->avatar
            ]);
        }
    }