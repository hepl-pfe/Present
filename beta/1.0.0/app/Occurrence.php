<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Occurrence extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'occurrences';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['cour_id','from','to'];

    public function schools()
    {
        return $this->belongsTo('App\School');
    }

    public function classes()
    {
        return $this->belongsTo('App\Classes');
    }

}
