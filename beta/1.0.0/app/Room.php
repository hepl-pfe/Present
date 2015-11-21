<?php

    namespace App;

    use Illuminate\Database\Eloquent\Model;
    use Cviebrock\EloquentSluggable\SluggableInterface;
    use Cviebrock\EloquentSluggable\SluggableTrait;

    class Room extends Model implements SluggableInterface
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
        protected $table = 'rooms';

        /**
         * The attributes that are mass assignable.
         *
         * @var array
         */
        protected $fillable = ['name', 'slug', 'school_id'];

        /**
         * Create a slug when school is create
         *
         * @param $value
         */
        public function setNameAttribute($value)
        {
            //$this->attributes['slug'] = Str::slug($value);
            $this->attributes['name'] = $value;
        }

        public function school()
        {
            return $this->belongsTo('App\School');
        }
    }
