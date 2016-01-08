<?php

    use Illuminate\Database\Seeder;

    class ClassesTableSeeder extends Seeder
    {
        /**
         * Run the database seeds.
         *
         * @return void
         */
        public function run()
        {
            $faker = \Faker\Factory::create('fr_BE');
            foreach (range(1, 3) as $index) {
                $name = $faker->unique()->numberBetween($min = 2180, $max = 2190);
                DB::table('classes')->insert([
                    'name'    => $name,
                    'slug'    => $name,
                    'user_id' => 1
                ]);
            }
        }
    }
