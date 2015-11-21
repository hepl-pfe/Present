<?php

    namespace App;

    use Illuminate\Database\Eloquent\Model;
    use Cviebrock\EloquentSluggable\SluggableInterface;
    use Cviebrock\EloquentSluggable\SluggableTrait;

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
            return $this->belongsToMany('App\User');
        }
        public function rooms()
        {
            return $this->hasMany('App\Room');
        }
        public function classes()
        {
            return $this->hasMany('App\Classes');
        }
    }
