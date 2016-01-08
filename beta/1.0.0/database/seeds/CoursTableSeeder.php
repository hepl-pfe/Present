<?php

    use Illuminate\Database\Seeder;

    class CoursTableSeeder extends Seeder
    {
        /**
         * Run the database seeds.
         *
         * @return void
         */
        public function run()
        {
            $faker = \Faker\Factory::create('fr_BE');
            foreach (range(1, 10) as $index) {
                $name = $faker->unique()->colorName();
                DB::table('cours')->insert([
                    'name'        => $name,
                    'description' => $faker->sentence(6),
                    'slug'        => $name,
                    'user_id'     => 1
                ]);
            }
        }
    }
