<?php

use Illuminate\Database\Seeder;

class ClasseCourTableSeeder extends Seeder
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
        foreach (range(1, 10) as $index) {
            DB::table('classe_cour')->insert([
                'cour_id' => $i,
                'classe_id'  => $faker->numberBetween(1, 3),
            ]);
            $i++;
        }
    }
}
