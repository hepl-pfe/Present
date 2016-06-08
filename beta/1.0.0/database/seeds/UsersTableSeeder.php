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
                'name' => 'Daniel',
                'slug'       => 'daniel-schreurs',
                'email'      => 'daniel.schreurs@hotmail.com',
                'password'   => bcrypt('etwas'),
            ]);

        }
    }
