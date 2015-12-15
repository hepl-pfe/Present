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

            /*$faker = \Faker\Factory::create('fr_BE');
            foreach (range(1, 3) as $index) {
                DB::table('users')->insert([
                    'first_name' => $faker->firstNameMale,
                    'last_name'  => $faker->lastName,
                    'slug'       => str_random(56),
                    'email'      => $faker->email,
                    'password'   => bcrypt('12345'),
                ]);
            }*/

        }
    }
