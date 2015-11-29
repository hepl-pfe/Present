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

    /**
     * App\User
     *
     * @property integer                                                     $id
     * @property string                                                      $first_name
     * @property string                                                      $last_name
     * @property string                                                      $slug
     * @property string                                                      $email
     * @property string                                                      $password
     * @property string                                                      $remember_token
     * @property \Carbon\Carbon                                              $created_at
     * @property \Carbon\Carbon                                              $updated_at
     * @property-read \Illuminate\Database\Eloquent\Collection|\App\School[] $schools
     * @property-read \Illuminate\Database\Eloquent\Collection|\App\Cour[]   $cours
     * @method static \Illuminate\Database\Query\Builder|\App\User whereId($value)
     * @method static \Illuminate\Database\Query\Builder|\App\User whereFirstName($value)
     * @method static \Illuminate\Database\Query\Builder|\App\User whereLastName($value)
     * @method static \Illuminate\Database\Query\Builder|\App\User whereSlug($value)
     * @method static \Illuminate\Database\Query\Builder|\App\User whereEmail($value)
     * @method static \Illuminate\Database\Query\Builder|\App\User wherePassword($value)
     * @method static \Illuminate\Database\Query\Builder|\App\User whereRememberToken($value)
     * @method static \Illuminate\Database\Query\Builder|\App\User whereCreatedAt($value)
     * @method static \Illuminate\Database\Query\Builder|\App\User whereUpdatedAt($value)
     */
    class User extends Model implements AuthenticatableContract,
                                        AuthorizableContract,
                                        CanResetPasswordContract,
                                        SluggableInterface
    {
        use Authenticatable, Authorizable, CanResetPassword, SluggableTrait;

        protected $sluggable = [
            'build_from' => 'fullname',
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

        public function getFullnameAttribute()
        {
            return $this->first_name . ' ' . $this->last_name;
        }


        public function getHasOccurrenceAttribute()
        {
            return  ! is_null(Occurrence::all()->where('user_id',$this->id)->first());
        }
        public function getGetAllOccurrenceAttribute()
        {
            return  Occurrence::all()->where('user_id',$this->id);
        }


        /**
         * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
         */
        public function schools()
        {
            return $this->hasMany('App\School');
        }

        public function cours()
        {
            return $this->hasMany('App\Cour');
        }

        public function students()
        {
            return $this->hasMany('App\Student');
        }

        public function classes()
        {
            return $this->hasMany('App\Classe');
        }

        public function occurrences()
        {
            return $this->hasMany('App\Occurrence');
        }

    }
