<?php

    namespace App;

    use Illuminate\Database\Eloquent\Model;
    use Illuminate\Support\Str;

    class Room extends Model
    {
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
            $this->attributes['slug'] = Str::slug($value);
            $this->attributes['name'] = $value;
        }

        public function setSchoolIdAttribute($value)
        {
            $this->attributes['school_id'] = User::GetUserSchoolId();
        }

        public function school()
        {
            return $this->belongsTo('App\School');
        }
    }
