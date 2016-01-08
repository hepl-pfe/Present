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
            foreach (range(1, 3) as $index) {
                $from = $faker->dateTimeBetween(\Carbon\Carbon::now(), \Carbon\Carbon::now()->addMonth());
                $to = \Carbon\Carbon::createFromFormat('Y-m-d', $from->format('Y-m-d'))->addMonths(2);
                DB::table('occurrences')->insert([
                    'from'       => $from,
                    'to'         => $to,
                    'day'        => $faker->numberBetween(0, 7),
                    'from_hour'  => $from,
                    'to_hour'    => $to,
                    'cour_id'    => $faker->numberBetween(1, 10),
                    'classe_id'  => $faker->numberBetween(1, 2),
                    'user_id'    => 1,
                    'created_at' => \Carbon\Carbon::now(),
                    'updated_at' => \Carbon\Carbon::now(),
                ]);
            }
        }
    }
