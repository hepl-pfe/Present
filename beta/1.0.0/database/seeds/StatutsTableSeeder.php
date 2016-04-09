<?php

    use Illuminate\Database\Seeder;

    class StatutsTableSeeder extends Seeder
    {
        /**
         * Run the database seeds.
         *
         * @return void
         */
        public function run()
        {
            $faker = \Faker\Factory::create('fr_BE');
            DB::table('statuts')->insert([
                'user_id' => 1,
                'name'    => 'Présent',
                'color'   => '#2FC85A',
                'slug'    => 'present'
            ]);
            DB::table('statuts')->insert([
                'user_id' => 1,
                'name'    => 'Absent',
                'color'   => '#E34A78',
                'slug'    => 'absent'
            ]);
            DB::table('statuts')->insert([
                'user_id' => 1,
                'name'    => 'Retard justifié',
                'color'   => '#0933FF',
                'slug'    => 'retard_justifie'
            ]);

        }
    }
