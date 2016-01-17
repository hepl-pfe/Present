<?php

    use Illuminate\Database\Seeder;

    class PresentTableSeeder extends Seeder
    {
        /**
         * Run the database seeds.
         *
         * @return void
         */
        public function run()
        {
            $faker = \Faker\Factory::create('fr_BE');
            $iMaxOccurrence = \App\Occurrence::all()->count();
            $iMaxStudent = \App\Student::all()->count();
            $iOccurrences = 1;

            // because while in while does not work
            foreach (range(1, $iMaxOccurrence) as $index) {
                $iStudents = 1;
                foreach (range(1, $iMaxStudent) as $index) {
                    DB::table('presents')->insert([
                        'student_id'    => $iStudents,
                        'occurrence_id' => $iOccurrences,
                        'is_present'    => $faker->boolean(70),
                        'created_at'    => \Carbon\Carbon::now(),
                        'updated_at'    => \Carbon\Carbon::now()
                    ]);
                    $iStudents++;
                }
                ++$iOccurrences;
            }
        }
    }
