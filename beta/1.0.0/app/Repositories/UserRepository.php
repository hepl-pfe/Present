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
         * @return static
         */
        public function findByUsernameOrCreate($userData)
        {

            return User::firstOrCreate([
                'first_name' => $userData->nickname,
                'last_name' => $userData->nickname,
                'email'    => $userData->email,
                'avatar'   => $userData->avatar
            ]);
        }
    }