<?php

    namespace App;

    use Illuminate\Database\Eloquent\Model;
    use Cviebrock\EloquentSluggable\SluggableInterface;
    use Cviebrock\EloquentSluggable\SluggableTrait;

    /**
     * App\Classe
     *
     * @property integer                                                         $id
     * @property string                                                          $name
     * @property string                                                          $slug
     * @property integer                                                         $user_id
     * @property \Carbon\Carbon                                                  $created_at
     * @property \Carbon\Carbon                                                  $updated_at
     * @property-read \App\User                                                  $user
     * @property-read \Illuminate\Database\Eloquent\Collection|\App\Student[]    $students
     * @property-read \Illuminate\Database\Eloquent\Collection|\App\Occurrence[] $occurrences
     * @method static \Illuminate\Database\Query\Builder|\App\Classe whereId($value)
     * @method static \Illuminate\Database\Query\Builder|\App\Classe whereName($value)
     * @method static \Illuminate\Database\Query\Builder|\App\Classe whereSlug($value)
     * @method static \Illuminate\Database\Query\Builder|\App\Classe whereUserId($value)
     * @method static \Illuminate\Database\Query\Builder|\App\Classe whereCreatedAt($value)
     * @method static \Illuminate\Database\Query\Builder|\App\Classe whereUpdatedAt($value)
     */
    class Classe extends Model implements SluggableInterface
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
        protected $fillable = ['name', 'slug', 'user_id'];

        public function user()
        {
            return $this->belongsTo('App\User');
        }

        public function students()
        {
            return $this->belongsToMany('App\Student');
        }

        public function cours()
        {
            return $this->belongsToMany('App\Cour');
        }

        public function occurrences()
        {
            return $this->hasMany('App\Occurrence');
        }
    }
