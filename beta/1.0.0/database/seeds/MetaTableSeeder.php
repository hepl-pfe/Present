<?php

    use Illuminate\Database\Seeder;

    class MetaTableSeeder extends Seeder
    {
        /**
         * Run the database seeds.
         *
         * @return void
         */
        public function run()
        {
            foreach (config('app.defaultMetas') as $key => $value) {
                DB::table('meta')->insert([
                    'value'   => $value,
                    'name'    => $key,
                    'user_id' => 1
                ]);
            }
        }
    }
