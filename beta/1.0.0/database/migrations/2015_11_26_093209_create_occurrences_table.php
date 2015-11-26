<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOccurrencesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('occurrences', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamp('from');
            $table->timestamp('to');
            $table->integer('cour_id')->unsigned();
            $table->foreign('cour_id')
                ->references('id')->on('cours')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('occurrences',function(Blueprint $table){
            $table->dropForeign('occurrences_cour_id_foreign');
        });
        Schema::drop('occurrences');
    }
}
