<?php

    use Illuminate\Database\Seeder;

    class ClasseStudentTableSeeder extends Seeder
    {
        /**
         * Run the database seeds.
         *
         * @return void
         */
        public function run()
        {
            $faker = \Faker\Factory::create('fr_BE');
            $i = 1;
            foreach (range(1, 30) as $index) {
                DB::table('classe_student')->insert([
                    'classe_id'  => $faker->numberBetween(1, 3),
                    'student_id' => $i,
                ]);
                $i++;
            }
        }
    }
