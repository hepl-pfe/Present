<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Classes extends Model
{

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'class';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'slug', 'school_id'];

    /**
     * Create a slug when Class is create
     *
     * @param $value
     */
    public function setNameAttribute($value)
    {
        $this->attributes['slug'] = Str::slug($value);
        $this->attributes['name'] = $value;
    }

    public function school()
    {
        return $this->belongsTo('App\School');
    }
}
