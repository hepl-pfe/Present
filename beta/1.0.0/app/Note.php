<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'notes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['user_id', 'student_id', 'note'];

    public function student()
    {
        return $this->belongsTo('App\Student');
    }

    public function user()
    {
        return $this->belongsTo('App\user');
    }

}
