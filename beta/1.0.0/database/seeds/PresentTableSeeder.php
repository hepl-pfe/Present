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
            foreach (range(1, $iMaxOccurrence) as $index) {
                foreach (\App\Occurrence::findOrFail($iOccurrences)->classe()->get() as $classe) {
                    foreach ($classe->students as $student) {
                        DB::table('presents')->insert([
                            'student_id'    => $student->id,
                            'occurrence_id' => $iOccurrences,
                            'statut_id'     => $faker->numberBetween($min = 1, $max = 3),
                            'created_at'    => \Carbon\Carbon::now(),
                            'updated_at'    => \Carbon\Carbon::now()
                        ]);
                    }
                }
                ++$iOccurrences;
            }
        }
    }
