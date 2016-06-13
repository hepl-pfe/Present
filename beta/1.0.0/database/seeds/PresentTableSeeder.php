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
            $allOccurrences = \App\Occurrence::all();
            foreach ($allOccurrences as $index) {
                foreach (\App\Occurrence::findOrFail($index->id)->classe()->get() as $classe) {
                    foreach ($classe->students as $student) {
                        DB::table('presents')->insert([
                            'student_id'    => $student->id,
                            'occurrence_id' => $index->id,
                            'statut_id'     => $faker->numberBetween($min = 1, $max = 3),
                            'created_at'    => \Carbon\Carbon::now(),
                            'updated_at'    => \Carbon\Carbon::now()
                        ]);
                    }
                }
            }
        }
    }
