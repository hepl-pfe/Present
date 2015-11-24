<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\SluggableInterface;
use Cviebrock\EloquentSluggable\SluggableTrait;

/**
 * App\Classes
 *
 * @property integer $id
 * @property string $name
 * @property string $slug
 * @property integer $school_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property-read \App\School $school
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Student[] $students
 * @method static \Illuminate\Database\Query\Builder|\App\Classes whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Classes whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Classes whereSlug($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Classes whereSchoolId($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Classes whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Classes whereUpdatedAt($value)
 */
class Classes extends Model implements SluggableInterface
{


    use SluggableTrait;

    protected $sluggable = [
        'build_from' => 'name',
        'save_to'    => 'slug',
    ];

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'classes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'slug', 'school_id'];


    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function students()
    {
        return $this->belongsToMany('App\Student');
    }

}
