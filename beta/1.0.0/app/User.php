<?php

    namespace App;

    use Illuminate\Auth\Authenticatable;
    use Illuminate\Database\Eloquent\Model;
    use Illuminate\Auth\Passwords\CanResetPassword;
    use Illuminate\Foundation\Auth\Access\Authorizable;
    use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
    use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
    use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
    use Illuminate\Support\Str;

    class User extends Model implements AuthenticatableContract,
                                        AuthorizableContract,
                                        CanResetPasswordContract
    {
        use Authenticatable, Authorizable, CanResetPassword;

        /**
         * The database table used by the model.
         *
         * @var string
         */
        protected $table = 'users';

        /**
         * The attributes that are mass assignable.
         *
         * @var array
         */
        protected $fillable = ['first_name', 'last_name', 'slug', 'email', 'password'];

        public function setFirstNameAttribute($value)
        {
            $slug = Str::slug($value);
            if (count(User::where('slug', '=', $slug)->get())) {
                if ($this->slug) {
                    $slug = $this->slug;
                } else {
                    $slug .= '-' . (\DB::table('users')->max('id') + 1);
                }
            }
            $this->attributes['slug'] = $slug;
            $this->attributes['first_name'] = $value;
        }

        /**
         * The attributes excluded from the model's JSON form.
         *
         * @var array
         */
        protected $hidden = ['password', 'remember_token'];
    }
