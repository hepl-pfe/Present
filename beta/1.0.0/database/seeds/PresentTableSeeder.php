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
            $iStudents = 1;
            while ($iOccurrences <= $iMaxOccurrence) {
                while ($iStudents <= $iMaxStudent) {
                    DB::table('presents')->insert([
                        'student_id'    => $iStudents,
                        'occurrence_id' => $iOccurrences,
                        'is_present'    => $faker->numberBetween(0, 1),
                        'created_at'    => \Carbon\Carbon::now(),
                        'updated_at'    => \Carbon\Carbon::now()
                    ]);
                    $iStudents++;
                }
                $iOccurrences++;
            }
        }
    }
