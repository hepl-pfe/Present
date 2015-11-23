<?php

    namespace App;

    use Illuminate\Auth\Authenticatable;
    use Illuminate\Database\Eloquent\Model;
    use Illuminate\Auth\Passwords\CanResetPassword;
    use Illuminate\Foundation\Auth\Access\Authorizable;
    use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
    use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
    use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
    use Cviebrock\EloquentSluggable\SluggableInterface;
    use Cviebrock\EloquentSluggable\SluggableTrait;

    class User extends Model implements AuthenticatableContract,
                                        AuthorizableContract,
                                        CanResetPasswordContract,
                                        SluggableInterface
    {
        use Authenticatable, Authorizable, CanResetPassword,SluggableTrait;

        protected $sluggable = [
            'build_from' => ['first_name','last_name'],
            'save_to'    => 'slug',
        ];

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
        protected $fillable = ['first_name', 'last_name', 'slug', 'email', 'password', 'school_id'];

        /**
         * @var array
         */
        protected $hidden = ['password', 'remember_token'];

        /**
         * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
         */
        public function schools()
        {
            return $this->belongsToMany('App\School');
        }

        public function cours()
        {
            return $this->hasMany('App\Cour');
        }


    }
