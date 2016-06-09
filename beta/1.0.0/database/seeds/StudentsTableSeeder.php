<?php

    use Illuminate\Database\Seeder;

    class StudentsTableSeeder extends Seeder
    {
        /**
         * Run the database seeds.
         *
         * @return void
         */
        public function run()
        {
            $faker = \Faker\Factory::create('fr_BE');
            foreach (range(1, 30) as $index) {
                $first_name = $faker->unique()->firstName;
                $last_name = $faker->unique()->lastName;
                DB::table('students')->insert([
                    'first_name' => $first_name,
                    'last_name'  => $last_name,
                    'slug'       => str_slug($first_name . ' ' . $last_name, '-'),
                    'email'      => $faker->unique()->email,
                    'user_id'    => 1
                ]);
            }
        }
    }
