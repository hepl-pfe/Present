<?php

    use Illuminate\Database\Seeder;

    class UsersTableSeeder extends Seeder
    {
        /**
         * Run the database seeds.
         *
         * @return void
         */
        public function run()
        {

            DB::table('users')->insert([
                'first_name' => 'Daniel',
                'last_name'  => 'Schreurs',
                'slug'       => 'daniel-schreurs',
                'email'      => 'daniel.schreurs@hotmail.com',
                'password'   => bcrypt('123456789'),
            ]);

        }
    }
