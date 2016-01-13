<?php

    use Illuminate\Database\Seeder;

    class OccurrencesTableSeeder extends Seeder
    {
        /**
         * Run the database seeds.
         *
         * @return void
         */
        public function run()
        {
            $faker = \Faker\Factory::create('fr_BE');
            $start_period = \Carbon\Carbon::now();
            $end_period = \Carbon\Carbon::now()->addMonths(2);
            $day = $faker->numberBetween(0, 4);
            while ($start_period->lte($end_period)) {
                if ($start_period->dayOfWeek == $day) {
                    DB::table('occurrences')->insert([
                        'from'       => $start_period,
                        'to'         => $end_period,
                        'day'        => $day,
                        'from_hour'  => $start_period,
                        'to_hour'    => $end_period,
                        'cour_id'    => $faker->numberBetween(1, 10),
                        'classe_id'  => $faker->numberBetween(1, 2),
                        'user_id'    => 1,
                        'created_at' => \Carbon\Carbon::now(),
                        'updated_at' => \Carbon\Carbon::now(),
                    ]);
                }
                $start_period->addDay(1);
            }
        }
    }
