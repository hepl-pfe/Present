<?php

    namespace App;

    use Illuminate\Database\Eloquent\Model;
    use Illuminate\Support\Str;

    class School extends Model
    {
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

        /**
         * Create a slug when school is create
         *
         * @param $value
         */
        public function setNameAttribute($value)
        {
            $this->attributes['slug'] = Str::slug($value);
            $this->attributes['name'] = $value;
        }

        public function users()
        {
            return $this->hasMany('App\User');
        }
        public function rooms()
        {
            return $this->hasMany('App\Room');
        }
    }
