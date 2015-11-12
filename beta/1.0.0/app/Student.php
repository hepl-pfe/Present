<?php

    namespace App;

    use Illuminate\Database\Eloquent\Model;
    use Illuminate\Support\Str;

    class Student extends Model
    {
        /**
         * The database table used by the model.
         *
         * @var string
         */
        protected $table = 'students';

        /**
         * The attributes that are mass assignable.
         *
         * @var array
         */
        protected $fillable = ['first_name', 'last_name', 'slug', 'email_parent', 'email', 'photo', 'password'];

        /**
         * Create a slug when user is create
         *
         * @param $value
         */
        public function setFirstNameAttribute($value)
        {
            $slug = Str::slug($value);
            if (count(User::where('slug', '=', $slug)->get())) {
                if ($this->slug) {
                    $slug = $this->slug;
                } else {
                    $slug .= '-' . (\DB::table('students')->max('id') + 1);
                }
            }
            $this->attributes['slug'] = $slug;
            $this->attributes['first_name'] = $value;
        }
    }
