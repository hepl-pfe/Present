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
            foreach (config('app.coursTable') as $index) {
                DB::table('cours')->insert([
                    'name'        => $index,
                    'description' => $faker->sentence(6),
                    'slug'        => str_slug($index, '-'),
                    'user_id'     => 1
                ]);
            }
        }
    }
