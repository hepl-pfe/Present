<?php

    namespace App;

    use Illuminate\Database\Eloquent\Model;
    use Cviebrock\EloquentSluggable\SluggableInterface;
    use Cviebrock\EloquentSluggable\SluggableTrait;

    /**
     * App\School
     *
     * @property integer                                                      $id
     * @property string                                                       $name
     * @property string                                                       $slug
     * @property \Carbon\Carbon                                               $created_at
     * @property \Carbon\Carbon                                               $updated_at
     * @property-read \Illuminate\Database\Eloquent\Collection|\App\User[]    $users
     * @property-read \Illuminate\Database\Eloquent\Collection|\App\Room[]    $rooms
     * @property-read \Illuminate\Database\Eloquent\Collection|\App\Classes[] $classes
     * @property-read \Illuminate\Database\Eloquent\Collection|\App\Student[] $students
     * @method static \Illuminate\Database\Query\Builder|\App\School whereId($value)
     * @method static \Illuminate\Database\Query\Builder|\App\School whereName($value)
     * @method static \Illuminate\Database\Query\Builder|\App\School whereSlug($value)
     * @method static \Illuminate\Database\Query\Builder|\App\School whereCreatedAt($value)
     * @method static \Illuminate\Database\Query\Builder|\App\School whereUpdatedAt($value)
     * @method static \Illuminate\Database\Query\Builder|\App\School getAllOtherSchools()
     */
    class School extends Model implements SluggableInterface
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
        protected $table = 'schools';

        /**
         * The attributes that are mass assignable.
         *
         * @var array
         */
        protected $fillable = ['name', 'slug'];

        public function users()
        {
            return $this->belongsTo('App\User');
        }

        public function rooms()
        {
            return $this->hasMany('App\Room');
        }

        public function classes()
        {
            return $this->hasMany('App\Classes');
        }

        public function students()
        {
            return $this->hasMany('App\Student');
        }

        public function occurrences()
        {
            return $this->hasMany('App\Occurrence');
        }
    }
